public with sharing class PayslipController {
    public String employeeName { get; set; }
    public String employeeId { get; set; }
    public String department { get; set; }
    public Decimal basicSalary { get; set; }
    public Decimal allowances { get; set; }
    public Decimal deductions { get; set; }

    public PayslipController() {
        Map<String, String> params =
            ApexPages.currentPage().getParameters();

        employeeName = params.get('employeeName');
        employeeId = params.get('employeeId');
        department = params.get('department');

        basicSalary = parseAmount(params.get('basicSalary'));
        allowances = parseAmount(params.get('allowances'));
        deductions = parseAmount(params.get('deductions'));
    }

    public Decimal getGrossSalary() {
        return zeroIfNull(basicSalary) +
               zeroIfNull(allowances);
    }

    public Decimal getNetSalary() {
        return getGrossSalary() - zeroIfNull(deductions);
    }

    private Decimal zeroIfNull(Decimal value) {
        return value == null ? 0 : value;
    }

    private static Decimal parseAmount(String value) {
        if (String.isBlank(value)) {
            return 0;
        }

        try {
            Decimal amount = Decimal.valueOf(value);
            return amount >= 0 ? amount : 0;
        } catch (Exception ex) {
            return 0;
        }
    }

    @AuraEnabled
    public static String buildPdfUrl(
        String employeeName,
        String employeeId,
        String department,
        Decimal basicSalary,
        Decimal allowances,
        Decimal deductions
    ) {
        if (String.isBlank(employeeName) ||
            String.isBlank(employeeId)) {
            throw new AuraHandledException(
                'Employee name and ID are required.'
            );
        }

        Decimal basic = basicSalary == null ? 0 : basicSalary;
        Decimal allowance = allowances == null ? 0 : allowances;
        Decimal deduction = deductions == null ? 0 : deductions;

        if (basic < 0 || allowance < 0 || deduction < 0) {
            throw new AuraHandledException(
                'Salary values cannot be negative.'
            );
        }

        if (deduction > basic + allowance) {
            throw new AuraHandledException(
                'Deductions cannot exceed gross salary.'
            );
        }

        PageReference pageRef = new PageReference('/apex/PayslipPDF');
        pageRef.getParameters().put('employeeName', employeeName);
        pageRef.getParameters().put('employeeId', employeeId);
        pageRef.getParameters().put('department', department);
        pageRef.getParameters().put('basicSalary', String.valueOf(basic));
        pageRef.getParameters().put('allowances', String.valueOf(allowance));
        pageRef.getParameters().put('deductions', String.valueOf(deduction));

        return pageRef.getUrl();
    }
}

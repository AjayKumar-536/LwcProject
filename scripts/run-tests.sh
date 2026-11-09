#!/usr/bin/env bash
set -e
ORG=${1:-HospitalOrg}
sf apex run test --class-names HospitalControllersTest --result-format human --wait 20 --target-org "$ORG"

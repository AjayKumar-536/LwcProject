#!/usr/bin/env bash
set -e
ORG=${1:-HospitalOrg}
sf project deploy start --source-dir force-app --target-org "$ORG"

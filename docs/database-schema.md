Applications

Purpose:
Stores accommodation applications submitted by students.

Business Rule:
Applications remain locked after submission.
Only an agent can return an application for editing.

Related Tables:
students
sureties
contracts


# Contracts

## Purpose

Stores the legally binding lease agreement generated after an application has been approved.

## Business Rules

- One approved application can only have one active contract.
- Contracts are generated from the standard lease template.
- Contracts become read-only once signatures begin.
- If contract details change, the current contract is cancelled and a new one is generated.

## Related Tables

- applications
- students
- sureties
- contract_signatures
- contract_documents
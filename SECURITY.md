<p align="center">
  <img src="https://hack23.github.io/cia-compliance-manager/icon-192.png" alt="Hack23 AB Logo" width="192" height="192">
</p>

<h1 align="center">🔐 Hack23 AB — Game Template Security Policy</h1>

<p align="center">
  <strong>🛡️ Security Through Transparency and Excellence</strong><br>
  <em>🎯 Security-first game development with verifiable compliance</em>
</p>

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/Owner-CEO-0A66C2?style=for-the-badge" alt="Owner"/></a>
  <a href="#"><img src="https://img.shields.io/badge/Version-1.0-555?style=for-the-badge" alt="Version"/></a>
  <a href="#"><img src="https://img.shields.io/badge/Effective-2025--11--10-success?style=for-the-badge" alt="Effective Date"/></a>
  <a href="#"><img src="https://img.shields.io/badge/Review-Quarterly-orange?style=for-the-badge" alt="Review Cycle"/></a>
</p>

**📋 Document Owner:** CEO | **📄 Version:** 1.0 | **📅 Last Updated:** 2025-11-10 (UTC)  
**🔄 Review Cycle:** Quarterly | **⏰ Next Review:** 2026-02-10

---

## 🎯 Security Commitment

At Hack23 AB, we are committed to maintaining the highest standards of security in all our projects. This game template implements comprehensive security measures aligned with our **[Information Security Management System (ISMS)](https://github.com/Hack23/ISMS-PUBLIC)**, providing verifiable transparency and demonstrating security excellence.

## 📋 ISMS Policy Framework

All security practices in this repository are governed by our publicly available ISMS policies:

### 🔐 Core Security Policies

| Policy | Purpose | Link |
|--------|---------|------|
| 🔐 **Information Security Policy** | Overarching security governance and principles | [View Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Information_Security_Policy.md) |
| 🛠️ **Secure Development Policy** | SDLC, testing, deployment, and CI/CD requirements | [View Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md) |
| 📦 **Open Source Policy** | Open source usage, license compliance, supply chain security | [View Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Open_Source_Policy.md) |
| 🏷️ **Data Classification Policy** | Data sensitivity levels, handling requirements | [View Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Data_Classification_Policy.md) |
| 🔒 **Privacy Policy** | Personal data protection, GDPR compliance | [View Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Privacy_Policy.md) |
| 🔑 **Access Control Policy** | Authentication, authorization, identity management | [View Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Access_Control_Policy.md) |

### 📊 Complete Feature Mapping

For a comprehensive mapping of game template features to ISMS policies, see our **[ISMS Policy Mapping](docs/ISMS_POLICY_MAPPING.md)** document.

---

## ✅ Supported Versions

This project is under active development, and we provide security updates for the latest version only. Please ensure you're using the latest version of the project to receive security updates.

| Version | Supported          |
| ------- | ------------------ |
| latest  | :white_check_mark: |

---

## 🛡️ Security Features & Evidence

This template implements comprehensive security measures aligned with our **[Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md)** and **[Open Source Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Open_Source_Policy.md)**:

### 🔍 Static & Dynamic Analysis

- **🛡️ Static Analysis (SAST)** - CodeQL scanning for vulnerabilities
  - Policy: [Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md)
  - Implementation: [CodeQL Workflow](.github/workflows/codeql.yml)

- **🕷️ Dynamic Analysis (DAST)** - OWASP ZAP security testing
  - Policy: [Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md)
  - Implementation: [ZAP Workflow](.github/workflows/zap-scan.yml)

- **📋 Code Quality** - ESLint with TypeScript rules
  - Policy: [Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md)
  - Command: `npm run lint`

### 📦 Supply Chain Security

- **🏆 OSSF Scorecard** - Supply chain security assessment
  - Policy: [Open Source Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Open_Source_Policy.md)
  - Badge: [![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/Hack23/game/badge)](https://scorecard.dev/viewer/?uri=github.com/Hack23/game)

- **🔍 Dependency Review** - Automated dependency vulnerability checks
  - Policy: [Open Source Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Open_Source_Policy.md)
  - Implementation: [Dependency Review Workflow](.github/workflows/dependency-review.yml)

- **📜 License Compliance** - Automated license checking
  - Policy: [Open Source Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Open_Source_Policy.md)
  - Approved Licenses: MIT, Apache-2.0, BSD variants, ISC, CC0-1.0, Unlicense
  - Command: `npm run test:licenses`

- **📄 SBOM Generation** - Software Bill of Materials in SPDX format
  - Policy: [Open Source Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Open_Source_Policy.md)
  - Location: Included in every release

- **📊 SBOM Quality Validation** - Automated quality scoring with SBOMQS
  - Policy: [Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md)
  - Minimum Score: 7.0/10
  - Standards: NTIA-minimum-elements, BSI v1.1/v2.0

- **🏷️ Pinned Dependencies** - All GitHub Actions pinned to SHA hashes
  - Policy: [Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md)
  - Implementation: All `.github/workflows/*.yml` files

### 🔏 Build Integrity & Attestations

- **🔐 SLSA Provenance** - Build attestations for artifact verification
  - Policy: [Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md)
  - Verification: `gh attestation verify <artifact> --owner Hack23 --repo game`

- **🛡️ Immutable Releases** - Release artifacts cannot be tampered with
  - Policy: [Data Classification Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Data_Classification_Policy.md)
  - Implementation: GitHub release immutability enabled

- **🔏 Artifact Signing** - Cryptographic proof of build integrity
  - Policy: [Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md)
  - Format: In-toto attestations in JSONL format

### 🧪 Testing & Quality Assurance

- **✅ Unit Testing** - Vitest with minimum 80% coverage
  - Policy: [Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md)
  - Command: `npm run test`
  - Coverage: `npm run coverage`

- **🌐 E2E Testing** - Cypress end-to-end testing
  - Policy: [Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md)
  - Command: `npm run test:e2e`

- **⚡ Performance Testing** - Lighthouse audits (90+ score target)
  - Policy: [Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md)
  - Implementation: [Lighthouse Workflow](.github/workflows/lighthouse-performance.yml)

### 🔐 Security Infrastructure

- **🔒 Runner Hardening** - All CI/CD runners hardened with audit logging
  - Policy: [Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md)
  - Implementation: Step Security hardening in all workflows

- **🚨 Security Advisories** - Private vulnerability disclosure
  - Policy: [Information Security Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Information_Security_Policy.md)
  - Process: GitHub Security Advisories (see below)

### 👥 Secure Development Environment

- **🚀 GitHub Codespaces** - Secure, hardened development environment
  - Policy: [Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md) + [Access Control Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Access_Control_Policy.md)
  - Configuration: [.devcontainer](.devcontainer/)

- **🤖 GitHub Copilot** - AI-assisted development with security guidelines
  - Policy: [Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md)
  - Guidelines: [copilot-instructions.md](.github/copilot-instructions.md)

- **🔒 Security Specialist Agent** - Dedicated security expert agent
  - Policy: [Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md)
  - Configuration: [security-specialist.md](.github/agents/security-specialist.md)

---

## 🚨 Reporting a Vulnerability

We take the security of the game template project seriously. If you have found a potential security vulnerability, we kindly ask you to report it privately, so that we can assess and address the issue before it becomes publicly known.

Our vulnerability management process is governed by our **[Information Security Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Information_Security_Policy.md)** and follows industry best practices for responsible disclosure.

### 🔍 What Constitutes a Vulnerability

A vulnerability is a weakness or flaw in the project that can be exploited to compromise the security, integrity, or availability of the system or its data. Examples of vulnerabilities include, but are not limited to:

- Unauthenticated access to sensitive data
- Injection attacks (e.g., SQL injection, cross-site scripting)
- Insecure defaults or configurations
- Insufficient access controls
- Remote code execution

### 🛡️ How to Privately Report a Vulnerability using GitHub

Please follow these steps to privately report a security vulnerability:

1. On GitHub.com, navigate to the main page of the [game repository](https://github.com/Hack23/game).
2. Under the repository name, click **Security**. If you cannot see the "Security" tab, select the dropdown menu, and then click **Security**.
3. In the left sidebar, under "Reporting", click **Advisories**.
4. Click **Report a vulnerability** to open the advisory form.
5. Fill in the advisory details form. Provide as much information as possible to help us understand and reproduce the issue.
6. At the bottom of the form, click **Submit report**.

After you submit the report, the maintainers of the game repository will be notified. They will review the report, validate the vulnerability, and take necessary actions to address the issue. You will be added as a collaborator and credited for the security advisory.

### ⏱️ Disclosure Timeline

Upon receipt of a vulnerability report, our team will:

1. Acknowledge the report within 48 hours
2. Validate the vulnerability within 7 days
3. Develop and release a patch or mitigation within 30 days, depending on the complexity and severity of the issue
4. Publish a security advisory with a detailed description of the vulnerability and the fix

### 🏆 Recognition and Anonymity

We appreciate your effort in helping us maintain a secure and reliable project. If your report results in a confirmed security fix, we will recognize your contribution in the release notes and/or a public acknowledgment, unless you request to remain anonymous.

---

## 📚 Related Security Resources

### Internal Documentation
- 📊 **[ISMS Policy Mapping](docs/ISMS_POLICY_MAPPING.md)** - Complete mapping of features to ISMS policies
- 🛡️ **[Security Headers](SECURITY_HEADERS.md)** - Security headers implementation details
- 📖 **[README.md](README.md)** - Project overview with security features
- 🤖 **[Copilot Instructions](.github/copilot-instructions.md)** - Secure coding guidelines
- 🔒 **[Security Specialist Agent](.github/agents/security-specialist.md)** - Security expert agent

### ISMS-PUBLIC Policies
All security practices are governed by our publicly available ISMS:

- 🔐 **[Information Security Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Information_Security_Policy.md)** - Overall security governance
- 🛠️ **[Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md)** - SDLC and CI/CD requirements
- 📦 **[Open Source Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Open_Source_Policy.md)** - Supply chain security
- 🏷️ **[Data Classification Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Data_Classification_Policy.md)** - Data handling requirements
- 🔒 **[Privacy Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Privacy_Policy.md)** - Privacy and GDPR compliance
- 🔑 **[Access Control Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Access_Control_Policy.md)** - Authentication and authorization

---

## 📚 Related Documents

- 🔐 [Information Security Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Information_Security_Policy.md) - Overall security governance
- 🛠️ [Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md) - SDLC and CI/CD requirements
- 📦 [Open Source Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Open_Source_Policy.md) - Supply chain security
- 🏷️ [Data Classification Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Data_Classification_Policy.md) - Data handling requirements
- 🔒 [Privacy Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Privacy_Policy.md) - Privacy and GDPR compliance
- 🔑 [Access Control Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Access_Control_Policy.md) - Authentication and authorization
- 🔍 [Vulnerability Management](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Vulnerability_Management.md) - Security vulnerability handling
- 🏷️ [Classification Framework](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md) - CIA triad and impact levels

---

**📋 Document Control:**  
**✅ Approved by:** James Pether Sörling, CEO  
**📤 Distribution:** Public  
**🏷️ Classification:** [![Confidentiality: Public](https://img.shields.io/badge/C-Public-lightgrey?style=flat-square)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md#confidentiality-levels)  
**📅 Effective Date:** 2025-11-10  
**⏰ Next Review:** 2026-02-10  
**🎯 Framework Compliance:** [![ISO 27001](https://img.shields.io/badge/ISO_27001-2022_Aligned-blue?style=flat-square&logo=iso&logoColor=white)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md) [![NIST CSF 2.0](https://img.shields.io/badge/NIST_CSF-2.0_Aligned-green?style=flat-square&logo=nist&logoColor=white)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md) [![CIS Controls](https://img.shields.io/badge/CIS_Controls-v8.1_Aligned-orange?style=flat-square&logo=cisecurity&logoColor=white)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md) [![AWS Well-Architected](https://img.shields.io/badge/AWS-Well_Architected-orange?style=flat-square&logo=amazon-aws&logoColor=white)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md)

---

<div align="center">

**Thank you for helping us keep the game project and its users safe.**

*Part of Hack23 AB's commitment to transparency and security excellence*

</div>

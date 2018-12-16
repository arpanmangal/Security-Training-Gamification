export const ApiUrl = 'http://localhost:5380';
export const EmailRegex = new RegExp("^([a-zA-Z0-9_\.\-]+)@([a-zA-Z0-9_\.\-]+)\.([a-zA-Z]{2,5})$");
export const PasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,13}$/;
export const NameRegex = /[ !@#$%^&*()+\=\[\]{};':"\\|,.<>\/?]/; // Allowed: _-
export const TextRegex = /[!@#$%^&*()+\=\[\]{};':"\\|,.<>\/?]/; // Allowed: _-s
export const AdminSecretRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;
export const AlphaNumericRegex = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/; // Allowed: nothing

// Related to Level Info
export const Types = {
    "single": "Single Player",
    "multi": "Multi Player"
}

export const Difficulties = {
    "L1": "Basic",
    "L2": "Easy",
    "L3": "Normal",
    "L4": "Hard",
    "L5": "Challenging",
    "L6": "Extreme",
}

// Reference: https://searchsecurity.techtarget.com/resources
export const Categories = {
    "Data_Security": "Data Security",
    "Iden_Acc_Mgmt": "Identity and Access Management",
    "Net_Security": "Network Security",
    "Security_traing_job": "Security Training and Jobs",
    "Infosec_prog": "Infosec Programs",
    "Risk_mgmt": "Risk Management Strategies",
    "Info_security_threats": "Information Security Threats",
    "Network_threat_detec": "Network Threat Detection",
    "Plat_security": "Platform Security",
    "Security_compliance": "Security Compliance",
    "Soft_security": "Software Security",
    "Web_security_tools": "Web Security Tools",
    "Wireless_mobile_security": "Wireless and Mobile Security",
}
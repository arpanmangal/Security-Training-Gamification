export const ApiUrl = 'http://localhost:5380';
export const EmailRegex = new RegExp("^([a-zA-Z0-9_\.\-]+)@([a-zA-Z0-9_\.\-]+)\.([a-zA-Z]{2,5})$");
export const PasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,13}$/;
export const NameRegex = /[ !@#$%^&*()+\=\[\]{};':"\\|,.<>\/?]/; // Allowed: _-
export const TextRegex = /[!@#$%^&*()+\=\[\]{};':"\\|,.<>\/?]/; // Allowed: _-s
export const AdminSecretRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;
export const AlphaNumericRegex = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/; // Allowed: nothing

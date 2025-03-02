export class UserLogin {
    constructor(
        public email: string,
        public password: string,
    ) { }
}
export class UserRegister {
    constructor(
        public name: string,
        public email: string,
        public password: string,
        public role: string,
    ) { }
}
export interface AuthResponse {
    authorization: string;
    // ה-TOKEN שהתקבל
  }
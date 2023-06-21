export enum Role {
    USER = 'user',
    ADMIN = 'admin'
}

export enum Status {
    GUEST = 'guest',
    ACTIVE = 'active',
    BLOCKED = 'blocked'
}

export interface User {
    email: string,
    role: Role,
    status: Status
}

export interface ExtendedUser extends User {
    firstName: string,
    middleName: string,
    lastName: string,
    birthDate: string,
}

export enum Currency {
    RUB = 'RUB',
    USD = 'USD',
    EUR = 'EUR',
    HKD = 'HKD',
    CNY = 'CNY'
}

export interface BankAccount {
    currency: Currency,
    amount: number,
    accountNumber: string
}

export interface Card {
    trimmedNumber: string,
    holder: string,
    expiredDate: string
}

export enum Operation {
    SELL = 'sell',
    BUY = 'buy',
    RAISE = 'raise',
    WITHDRAW = 'withdraw'
}

export interface History {
    amount: number,
    balance: number,
    cost: number,
    date: number,
    fromAccountNumber: string,
    fromCurrency: Currency,
    operationType: Operation,
    toAccountNumber: string,
    toCurrency: Currency
}

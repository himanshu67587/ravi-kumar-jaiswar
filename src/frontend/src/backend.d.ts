import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Submission {
    id: bigint;
    email: string;
    message: string;
    timestamp: bigint;
    lastName: string;
    firstName: string;
}
export interface backendInterface {
    getAllSubmissions(): Promise<Array<Submission>>;
    getLatestSubmissions(count: bigint): Promise<Array<Submission>>;
    getSubmissionById(id: bigint): Promise<Submission>;
    getSubmissionsByEmail(email: string): Promise<Array<Submission>>;
    submitContact(firstName: string, lastName: string, email: string, message: string, timestamp: bigint): Promise<void>;
}

import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Department {
    id: string;
    name: string;
    semesters: Array<Semester>;
}
export type ResourceContent = {
    __kind__: "url";
    url: string;
} | {
    __kind__: "externalBlob";
    externalBlob: ExternalBlob;
};
export interface Semester {
    id: string;
    subjects: Array<Subject>;
    name: string;
}
export interface Resource {
    id: bigint;
    title: string;
    content: ResourceContent;
}
export interface Subject {
    id: string;
    resources: Array<Resource>;
    name: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addDepartment(id: string, name: string): Promise<void>;
    addResource(departmentId: string, semesterId: string, subjectId: string, title: string, content: ResourceContent): Promise<void>;
    addSubject(departmentId: string, semesterId: string, id: string, name: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    editDepartment(id: string, name: string): Promise<void>;
    editResource(departmentId: string, semesterId: string, subjectId: string, resourceId: bigint, title: string, content: ResourceContent): Promise<void>;
    editSubject(departmentId: string, semesterId: string, subjectId: string, name: string): Promise<void>;
    getAllDepartments(): Promise<Array<Department>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    removeDepartment(id: string): Promise<void>;
    removeResource(departmentId: string, semesterId: string, subjectId: string, resourceId: bigint): Promise<void>;
    removeSubject(departmentId: string, semesterId: string, subjectId: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}

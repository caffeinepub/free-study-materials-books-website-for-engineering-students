import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Semester {
    id: string;
    subjects: Array<Subject>;
    name: string;
}
export interface Resource {
    id: bigint;
    url: string;
    title: string;
}
export interface Department {
    id: string;
    name: string;
    semesters: Array<Semester>;
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
    addResource(departmentId: string, semesterId: string, subjectId: string, title: string, url: string): Promise<void>;
    addSemester(departmentId: string, id: string, name: string): Promise<void>;
    addSubject(departmentId: string, semesterId: string, id: string, name: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    editDepartment(id: string, name: string): Promise<void>;
    editResource(departmentId: string, semesterId: string, subjectId: string, resourceId: bigint, title: string, url: string): Promise<void>;
    editSemester(departmentId: string, semesterId: string, name: string): Promise<void>;
    editSubject(departmentId: string, semesterId: string, subjectId: string, name: string): Promise<void>;
    getAllDepartments(): Promise<Array<Department>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    removeDepartment(id: string): Promise<void>;
    removeResource(departmentId: string, semesterId: string, subjectId: string, resourceId: bigint): Promise<void>;
    removeSemester(departmentId: string, semesterId: string): Promise<void>;
    removeSubject(departmentId: string, semesterId: string, subjectId: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}

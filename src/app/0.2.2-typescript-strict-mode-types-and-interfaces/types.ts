// Zadanie
type Role = 'admin' | 'member' | 'viewer';
type Visibility = 'public' | 'private';
type Priority = 'low' | 'medium' | 'high';
interface User {
  id: number;
  name: string;
  role: Role;
  avatarUrl: string | undefined;
}
interface Profile {
  readonly userId: number;
  bio: string;
  visibility: Visibility;
};
interface Task {
  readonly id: string;
  title: string;
  priority: Priority;
  description: string | undefined; 
}


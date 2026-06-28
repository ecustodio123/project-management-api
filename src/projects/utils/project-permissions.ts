import { ProjectRole } from '@prisma/client';

export function canManageProject(role: ProjectRole) {
  return role === ProjectRole.OWNER || role === ProjectRole.ADMIN;
}

export function canDeleteProject(role: ProjectRole) {
  return role === ProjectRole.OWNER;
}

export function canManageMembers(role: ProjectRole) {
  return role === ProjectRole.OWNER || role === ProjectRole.ADMIN;
}

export function canUpdateMemberRoles(role: ProjectRole) {
  return role === ProjectRole.OWNER;
}

export function canWriteProjectContent(role: ProjectRole) {
  return (
    role === ProjectRole.OWNER ||
    role === ProjectRole.ADMIN ||
    role === ProjectRole.MEMBER
  );
}

export function canReadProject(role: ProjectRole) {
  return (
    role === ProjectRole.OWNER ||
    role === ProjectRole.ADMIN ||
    role === ProjectRole.MEMBER ||
    role === ProjectRole.VIEWER
  );
}

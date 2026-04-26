import rawMembers from './members.json';

const manifestModules = import.meta.glob('./generated/members-avatar-manifest.json', {
  eager: true,
  import: 'default',
});

const avatarManifest =
  manifestModules['./generated/members-avatar-manifest.json'] ?? {};

const members = (rawMembers.members ?? []).map((member) => ({
  ...member,
  avatar:
    typeof member.avatar === 'string' &&
    typeof avatarManifest[member.avatar] === 'string'
      ? avatarManifest[member.avatar]
      : member.avatar,
}));

export default {
  ...rawMembers,
  members,
};

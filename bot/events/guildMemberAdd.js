import fs from 'fs';
import { resolve } from 'path';

export const name = 'guildMemberAdd';
export async function execute(member) {
  const filePath = resolve(process.cwd(), 'data', 'autorole.json');
  if (!fs.existsSync(filePath)) return;

  let cfg;
  try {
    cfg = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return;
  }

  const roleId = cfg[member.guild.id];
  if (!roleId) return;

  try {
    await member.roles.add(roleId);
  } catch (err) {
    console.error(`❌ Échec ajout rôle à ${member.user.tag}`, err);
  }
}
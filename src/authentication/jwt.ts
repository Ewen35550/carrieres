import { sign, SignOptions, verify } from 'jsonwebtoken';
import * as fs from 'fs';
import * as path from 'path';
import { User } from '../models/User';
 
/**
 * création du token JWT
 */
export function generateToken(user: User) {
  let role: string;
  if (user.isAdmin) role = 'admin';
  else role = 'user';
  // Les informations que l'on souhaite enregistrer dans le token
  const payload = {
    lastname: user.lastname,
    firstname: user.firstname,
    userId: user.id,
    // Les accès à l'API que l'on souhaite ouvrir à ce partenaire
    accessTypes: [role]
  };
  // Lecture du fichier private.key permettant de crypter le JWT
  const privateKey = fs.readFileSync(path.join(__dirname, './../../private.key'));

  const signInOptions: SignOptions = {
    // RS256 utilises une paire de clé public/privée key.
    algorithm: 'RS256',
    // Durée de validité du token
    expiresIn: '10h'
  };

  // generation du token JWT
  // Note: la passphrase devrait être dans le .env
  return sign(payload, {key:privateKey, passphrase:process.env.KEY_PASSWORD!}, signInOptions);
}
 
interface TokenPayload {
  exp: number;
  accessTypes: string[];
  name: string;
  userId: number;
}
 
/**
  * Vérifie que le token JWT est valide
  *
  * @param token Le token JWT à valider
  * @return Promise<TokenPayload> Une promesse contenant les éléments utiles (le payload) contenu dans le token
*/
export function validateToken(token: string): Promise<TokenPayload> {
  const publicKey = fs.readFileSync(path.join(__dirname, './../../public.key'));

  return new Promise(function (resolve, reject) {
    verify(token, publicKey, (error, decoded) => {
      if (error) {
        return reject(error);
      }
      resolve(decoded as TokenPayload);
    });
  });
}
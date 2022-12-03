import { Pipe, PipeTransform } from '@angular/core';
import * as CryptoJS from 'crypto-js';

const secretCode = "madukkarai";

@Pipe({name: 'encrypted'})
export class EncryptPipe implements PipeTransform {
  transform(value: string) {
    if (value) {
      return CryptoJS.AES.encrypt(value, secretCode).toString();
    }else{
      return '';
    }
  }
}

@Pipe({name: 'decrypted'})
export class DecryptPipe implements PipeTransform {
  transform(encrypted: string) {
    if (encrypted) {
      var decrypted = CryptoJS.AES.decrypt(encrypted, secretCode);
     return decrypted.toString(CryptoJS.enc.Utf8);

    }
    else{
      return '';
    }
  }
}

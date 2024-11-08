import JSEncrypt from 'jsencrypt';

export default {
  publicKey: 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDEjtKeTrD280oM2vEDBR2/45GZpcgVgyKRFKSX2je/AiCsi8gNi7E94iTSi7PzDAXOCra23xei2zdTCIrF48PAWHdWNcSeDOXnYTfLRpjss+7ONvTWL71tG/+0zM1AcfyFVEwwmEmim+uJitro3DBLLfpjzO6eEqbZSnP1SUIIpQIDAQAB',
  privateKey: 'MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAMSO0p5OsPbzSgza8QMFHb/jkZmlyBWDIpEUpJfaN78CIKyLyA2LsT3iJNKLs/MMBc4KtrbfF6LbN1MIisXjw8BYd1Y1xJ4M5edhN8tGmOyz7s429NYvvW0b/7TMzUBx/IVUTDCYSaKb64mK2ujcMEst+mPM7p4SptlKc/VJQgilAgMBAAECgYAzWJvsfuH7oNJXSVpsT4nV9ryyRnxeIkOFYr8cbATkAMpISLuZzkQexlSYK6Z2d02M5X+VhfHGuT1ak4Cs8TLRNvmmOIl9QdOjihWK9YunL0ae3Qr2X61RxHHcZsGR+w7S4Qe+W9HgPE6k1ItT87Haou9cwmsLfLwjsSpKWHd8AQJBAOqy2e0hs39CtH4JxBxhFLTtsHJL8RtVEBkA4Hod540wl/ehqDA11++b3UuAK2kUUe893SghV+ZDjwkCDab8cS0CQQDWZciSkde47cPoi/qO2DES5SbOFTmdruvRp7qYGTST6tJUIisLe6+qLLmZElvZbCXp5D8Up74pZxyZR90Qx3BZAkBb8G4wV5hiTPY5vYemel1LNyV80MUFqP/iW5aUH+zaQWP2rMwe/qi1g4BgGDhpNH2YU8qz8sPlPyfkJnrEpHWNAkBe6pTPfs24S1sOGtqEXuXq7ZQubGsjigtQuCb9qzsBuVYAdVgFL27nsgFA6UXMjfqC/8+Ff3XKsqGQoqYWBZWRAkEAowlvZTqqa6DgLUZuBYlTBGRX5KdW9hdXr4oYjaG48OYu6G/Qf1gBL/RabOJrfrl8Vlszc9W85089hbVGBNKKYw==',
  // 公钥加密
  encryptByPublicKey(content){
    let encryptStr = new JSEncrypt();
    encryptStr.setPublicKey(this.publicKey); // 设置 加密公钥
    let data = encryptStr.encrypt(content.toString());  // 进行加密
    return data;
  },
  // 公钥解密
  decryptByPublicKey(content) {
    let encryptStr = new JSEncrypt();
    encryptStr.setPublicKey(this.publicKey); // 设置 加密公钥
    encryptStr.setPrivateKey(this.privateKey)
    let data = encryptStr.decrypt(content.toString());  // 进行解密
    return data;
  }
}

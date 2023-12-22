import JSEncrypt from 'jsencrypt';

export default {
  publicKey: 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDEjtKeTrD280oM2vEDBR2/45GZpcgVgyKRFKSX2je/AiCsi8gNi7E94iTSi7PzDAXOCra23xei2zdTCIrF48PAWHdWNcSeDOXnYTfLRpjss+7ONvTWL71tG/+0zM1AcfyFVEwwmEmim+uJitro3DBLLfpjzO6eEqbZSnP1SUIIpQIDAQAB',

  // 公钥加密
  encryptByPublicKey(content){
    let encryptStr = new JSEncrypt();
    encryptStr.setPublicKey(this.publicKey); // 设置 加密公钥
    let data = encryptStr.encrypt(content.toString());  // 进行加密
    return data;
  }

}

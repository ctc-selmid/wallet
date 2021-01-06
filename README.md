### Implementation

- Identity Wallet

#### Deployment

- Automatically deploy to https://wallet.selmid.me

#### Rule

- Create a branch with the name `issues/${number}` and commit it.

- Delete unnecessary imports as you find them.

#### Quick Start

```
yarn
yarn start
```

## エンドポイント

- Holder（browser-wallet）
  - https://browser-wallet.azurewebsites.net/
- Issuer（学生証）
  - https://vcissuer.azurewebsites.net/
- Issuer（チケット）
  - https://ticketissuer.azurewebsites.net/
- Issuer（didcon）
  - https://didcon.azurewebsites.net/
- Verifier
  - https://nfpoc-rp.azurewebsites.net/b2c.php

## 利用フローについて

利用フローの説明は Issuer を学生証（https://vcissuer.azurewebsites.net/ ）として行います。

1. browser-wallet を起動(https://browser-wallet.azurewebsites.net/ )
   <img width="361" alt="スクリーンショット 2020-11-12 15 26 33" src="https://user-images.githubusercontent.com/30500272/98903705-7ac42c00-24fb-11eb-8e07-d7d0fb34de33.png">
2. 学生証の QR を取得する(https://vcissuer.azurewebsites.net/ )
   <img width="246" alt="スクリーンショット 2020-11-12 15 30 07" src="https://user-images.githubusercontent.com/30500272/98903981-08a01700-24fc-11eb-9714-67c10cc8fb86.png">
3. browser-wallet で QR を読み込む
   <img width="362" alt="スクリーンショット 2020-11-12 15 32 31" src="https://user-images.githubusercontent.com/30500272/98904093-4e5cdf80-24fc-11eb-94d4-94eb36eafb80.png">
4. ボタンを押下して遷移先でログインを行う（学生であることの証明を行う）
   <img width="361" alt="スクリーンショット 2020-11-12 15 33 44" src="https://user-images.githubusercontent.com/30500272/98904474-08544b80-24fd-11eb-828f-d8db62a897a2.png">
5. Submit ボタンを押下して VC を取得する
   <img width="359" alt="スクリーンショット 2020-11-12 15 34 23" src="https://user-images.githubusercontent.com/30500272/98904935-e60efd80-24fd-11eb-8437-36b1a032f0ce.png">
   <img width="359" alt="スクリーンショット 2020-11-12 15 34 53" src="https://user-images.githubusercontent.com/30500272/98904967-f32bec80-24fd-11eb-8f7b-2c843b5d8276.png">
6. VC を Verifier に提出する(https://nfpoc-rp.azurewebsites.net/b2c.php )
   ![スクリーンショット 2020-11-12 16 17 55](https://user-images.githubusercontent.com/30500272/98907875-e067e680-2502-11eb-971f-e779e8a7af53.png)
   取得した QR を browser-wallet で読み込む

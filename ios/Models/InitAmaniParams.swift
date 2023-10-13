//
//  InitAmaniParams.swift
//  react-native-amani-sdk
//
//  Created by Deniz Can on 18.09.2023.
//

import Foundation

struct InitAmaniParams : Codable {
  let server: String
  let customerToken: String
  let idCardNumber: String
  let useLocation: Bool?
  let lang: String?
  let sharedSecret: String?
  let birthDate: String?
  let expireDate: String?
  let documentNo: String?
  let name: String?
  let email: String?
  let phone: String?
  
  let uploadSource: String?
  let apiVersion: String?
}

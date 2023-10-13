//
//  Dictionary+Extensions.swift
//  react-native-amani-sdk
//
//  Created by Deniz Can on 18.09.2023.
//

import Foundation

extension Dictionary where Key == String, Value == Any {
  func convertTo<T: Decodable>() -> T? {
    do {
      let data = try JSONSerialization.data(withJSONObject: self, options: [])
      return try JSONDecoder().decode(T.self, from: data)
    } catch {
      print(error)
    }
    return nil
  }
  
  func toJSONString() -> String? {
    do {
      let data = try JSONSerialization.data(withJSONObject: self, options: [])
      return String(data: data, encoding: .utf8)
    } catch {
      print(error)
    }
  }
  
}

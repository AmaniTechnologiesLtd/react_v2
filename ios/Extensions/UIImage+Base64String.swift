//
//  UIImage+Base64String.swift
//  react-native-amani-sdk
//
//  Created by Deniz Can on 18.09.2023.
//

import Foundation

extension UIImage {
  
  func toBase64PNGImage() -> String? {
    if let data = self.pngData() {
      return data.base64EncodedString()
    } else {
      return nil;
    }
  }
  
}

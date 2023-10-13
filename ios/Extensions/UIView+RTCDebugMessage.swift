//
//  UIView+RTCDebugMessage.swift
//  react-native-amani-sdk
//
//  Created by Deniz Can on 18.09.2023.
//

import Foundation
extension UIView {
  
  func showRCTDebugMessage(message: String) {
    if (RCT_DEBUG == 1) {
      let debugLabel: UILabel = {
        let label = UILabel()
        label.text = message
        label.translatesAutoresizingMaskIntoConstraints = false
        return label
      }()
      
      addSubview(debugLabel)
      NSLayoutConstraint.activate([
        debugLabel.centerXAnchor.constraint(equalTo: self.centerXAnchor),
        debugLabel.centerYAnchor.constraint(equalTo: self.centerYAnchor),
      ])
      
    }
  }
  
}

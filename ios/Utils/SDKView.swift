import Foundation
import UIKit

class SDKView: UIView {
  // This view adds button, takes an UIView from our Native SDK and adds
  // a close button.
  private var nativeSdkView: UIView!
  
  convenience init(sdkView: UIView) {
    self.init(frame: sdkView.frame)
    nativeSdkView = sdkView
  }
  
  override init(frame: CGRect) {
    super.init(frame: frame)
  }
  
  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
  
  private func setupBackButton(on view: UIView) {
    let backButton: UIButton = {
      let button = UIButton()
      
      if #available(iOS 13.0, *) {
        button.setImage(UIImage(systemName: "xmark"), for: .normal)
      } else {
        // Fallback on earlier versions
        // TODO: Move XMARK to assets
      }
      button.setTitleColor(.white, for: .normal)
      button.tintColor = .white
      button.addTarget(nil, action: #selector(buttonAction), for: .touchUpInside)
      
      return button
    }()
    
    DispatchQueue.main.async {
      view.addSubview(backButton)
      view.bringSubviewToFront(backButton)
      
      backButton.translatesAutoresizingMaskIntoConstraints = false
      NSLayoutConstraint.activate([
        backButton.topAnchor.constraint(equalTo: view.topAnchor, constant: 20),
        backButton.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20),
        backButton.widthAnchor.constraint(equalToConstant: 60),
        backButton.heightAnchor.constraint(equalToConstant: 60)
      ])
    }
  }
  
  public func start(on vc: UIViewController) {
    DispatchQueue.main.async {
      self.addSubview(self.nativeSdkView)
      self.setupBackButton(on: self.nativeSdkView)
      vc.view.addSubview(self)
      vc.view.bringSubviewToFront(self.nativeSdkView)
      vc.navigationController?.setNavigationBarHidden(true, animated: false)
    }
  }

  @objc
  func buttonAction() {
    DispatchQueue.main.async {
      self.removeFromSuperview()
    }
  }
}


//
//  RawNFCUploadConfig.swift
//  react-native-amani-sdk
//
//  Stopgap workaround: the native iOS SDK's ScanNFC.upload() sends `device_data` and
//  `upload_source` fields that the Android wrapper's hand-rolled upload never sends, and the
//  backend currently 500s on that shape for NFC documents ("Not implemented error Zeki").
//  NFCModule.upload() below bypasses the native upload and POSTs directly, mirroring the
//  Android wrapper (android/.../modules/NFC.kt uploadV1/uploadV2). This holder just caches the
//  values initAmani() already receives from JS so the raw upload can reach them without needing
//  access to the SDK's internal ClientUtility.
//
//  Remove this once the backend fix ships and NFCModule.upload() goes back to calling the
//  native SDK's own upload().
//

import Foundation

final class RawNFCUploadConfig {
  static var server: String = ""
  static var token: String = ""
  static var lang: String = "en"
  static var apiVersion: String = "v2"
}

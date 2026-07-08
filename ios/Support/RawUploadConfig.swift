//
//  RawUploadConfig.swift
//  react-native-amani-sdk
//
//  Stopgap workaround: the native iOS SDK's upload() methods (ScanNFC, Selfie, ...) send
//  `device_data` and `upload_source` fields that the Android wrapper's hand-rolled NFC upload
//  never sends, and the backend currently rejects that shape ("Not implemented error" /
//  "Not implemented error Zeki") for both NFC and Selfie documents. NFCModule.upload() and
//  SelfieModule.upload() bypass the native upload and POST directly instead, mirroring the
//  Android wrapper's minimal field set (android/.../modules/NFC.kt uploadV1/uploadV2). This
//  holder just caches the values initAmani() already receives from JS so the raw uploads can
//  reach them without needing access to the SDK's internal ClientUtility.
//
//  Remove this once the backend fix ships and the affected upload() methods go back to calling
//  the native SDK's own upload().
//

import Foundation

final class RawUploadConfig {
  static var server: String = ""
  static var token: String = ""
  static var lang: String = "en"
  static var apiVersion: String = "v2"
}

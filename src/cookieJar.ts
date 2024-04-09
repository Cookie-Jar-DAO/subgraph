import {
  AssessReason,
  GiveCookie,
  Setup,
} from "../generated/templates/CookieJarTemplate/CookieJar";
import { JSONValueKind, ethereum, json, log } from "@graphprotocol/graph-ts";
import { OwnershipTransferred } from "../generated/CookieJarFactory/CookieJarFactory";
import {
  loadOrCreateAssessment,
  loadOrCreateClaim,
  loadOrCreateCookieJar,
  loadOrCreateReason,
} from "./utils/cookieUtils";

export function handleSetup(event: Setup): void {
  log.info("handleSetup fired: {}", [event.transaction.hash.toHexString()]);
  let initializationParams = event.params.initializationParams;

  let decodedParams = ethereum.decode(
    "(address,uint256,uint256,address)",
    initializationParams
  );

  if (decodedParams == null) {
    log.info("Failed to decode initialization params", []);
    return;
  }

  let decoded = decodedParams.toTuple();

  let jar = loadOrCreateCookieJar(event.address);
  let periodLength = decoded[1];
  let cookieAmount = decoded[2];
  let cookieToken = decoded[3];

  if (periodLength && periodLength.kind == ethereum.ValueKind.UINT) {
    jar.periodLength = periodLength.toBigInt();
  }
  if (cookieAmount && cookieAmount.kind == ethereum.ValueKind.UINT) {
    jar.cookieAmount = cookieAmount.toBigInt();
    log.info("cookieAmount {}", [jar.cookieAmount.toString()]);
  }
  if (cookieToken && cookieToken.kind == ethereum.ValueKind.ADDRESS) {
    jar.cookieToken = cookieToken.toAddress();
    log.info("cookieToken {}", [cookieToken.toAddress().toHexString()]);
  }

  jar.save();
}

export function handleClaim(event: GiveCookie): void {
  log.info("handleClaim fired: {}", [event.transaction.hash.toHexString()]);
  let claimId = `${
    event.address
  }-${event.params.cookieMonster.toHexString()}-${event.params.cookieUid.toHexString()}`;

  let claim = loadOrCreateClaim(claimId);

  claim.uuid = event.params.cookieUid.toHexString();
  claim.claimer = event.transaction.from;
  claim.receiver = event.params.cookieMonster;
  claim.jar = event.address;
  claim.amount = event.params.amount;
  claim.timestamp = event.block.timestamp;

  let reason = loadOrCreateReason(event.params.cookieUid.toHexString());

  let reasonObj = json.fromString(event.params.reason);

  if (reasonObj.kind == JSONValueKind.OBJECT) {
    let obj = reasonObj.toObject();
    let tagVal = obj.get("tag");
    let reasonVal = obj.get("reason");
    let linkVal = obj.get("link");

    if (tagVal && tagVal.kind == JSONValueKind.STRING) {
      reason.tag = tagVal.toString();
    }
    if (reasonVal && reasonVal.kind == JSONValueKind.STRING) {
      reason.reason = reasonVal.toString();
    }
    if (linkVal && linkVal.kind == JSONValueKind.STRING) {
      reason.link = linkVal.toString();
    }
  }

  reason.save();
  claim.save();
}

export function handleAssessReason(event: AssessReason): void {
  log.info("handleAssessReason fired: {}", [
    event.transaction.hash.toHexString(),
  ]);

  let reason = loadOrCreateReason(event.params.cookieUid.toHexString());

  let assessment = loadOrCreateAssessment(event.params.cookieUid.toHexString());

  assessment.claim = event.params.cookieUid;
  assessment.assessor = event.transaction.from;
  assessment.assessment = event.params.isGood;

  reason.save();
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
  log.info("handleOwnershipTransferred fired: {}", [
    event.transaction.hash.toHexString(),
  ]);
  let jar = loadOrCreateCookieJar(event.address);
  jar.owner = event.params.newOwner;
  jar.save();
}

import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  Claim,
  CookieJar,
  Reason,
  ReasonAssessment,
} from "../../generated/schema";
import { ZERO_ADDRESS } from "./constants";

export function loadOrCreateCookieJar(cookieId: Address): CookieJar {
  let addressId = Bytes.fromHexString(cookieId.toHexString());
  let jar = CookieJar.load(addressId);

  if (jar == null) {
    jar = new CookieJar(addressId);
    jar.name = "";
    jar.type = "";
    jar.description = "";
    jar.link = "";
    jar.cookieAmount = BigInt.fromI32(0);
    jar.cookieToken = Address.fromString(ZERO_ADDRESS);
    jar.periodLength = BigInt.fromI32(0);
    jar.owner = Address.fromString(ZERO_ADDRESS);
    jar.save();
  }

  return jar as CookieJar;
}

export function loadOrCreateClaim(claimId: string): Claim {
  let id = Bytes.fromHexString(claimId);
  let claim = Claim.load(id);

  if (claim == null) {
    claim = new Claim(id);
    claim.uuid = "";
    claim.claimer = Address.fromString(ZERO_ADDRESS);
    claim.receiver = Address.fromString(ZERO_ADDRESS);
    claim.reason = Bytes.fromHexString(ZERO_ADDRESS);
    claim.jar = Address.fromHexString(ZERO_ADDRESS);
    claim.amount = BigInt.fromI32(0);
    claim.timestamp = BigInt.fromI32(0);
    claim.save();
  }

  return claim as Claim;
}

export function loadOrCreateReason(id: Bytes): Reason {

  let reason = Reason.load(id);

  if (reason == null) {
    reason = new Reason(id);
    reason.tag = "";
    reason.reason = "";
    reason.link = "";
    reason.save();
  }

  return reason as Reason;
}

export function loadOrCreateAssessment(assessmentId: string): ReasonAssessment {
  let id = Bytes.fromHexString(assessmentId);
  let assessment = ReasonAssessment.load(id);

  if (assessment == null) {
    assessment = new ReasonAssessment(id);
    assessment.claim = Bytes.fromHexString(ZERO_ADDRESS);
    assessment.assessor = Address.fromString(ZERO_ADDRESS);
    assessment.assessment = false;
    assessment.save();
  }

  return assessment as ReasonAssessment;
}

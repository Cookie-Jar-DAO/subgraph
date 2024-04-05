import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { CookieJar } from "../../generated/schema";
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
    jar.cookieCoolOffPeriod = BigInt.fromI32(0);
    jar.owner = Address.fromString(ZERO_ADDRESS);
    jar.save();
  }

  return jar as CookieJar;
}

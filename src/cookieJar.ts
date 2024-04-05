import { Setup } from "../generated/templates/CookieJar/CookieJar";
// import { Setup } from "../generated/ERC20CookieJar6551/ERC20CookieJar6551"
import { ethereum, log } from "@graphprotocol/graph-ts";
import { OwnershipTransferred } from "../generated/CookieJarFactory/CookieJarFactory";

export function handleSetup(event: Setup): void {
  log.info("fix {}", [event.transaction.hash.toHexString()]);
  let initializationParams = event.params.initializationParams;

  let decodedParams = ethereum.decode(
    "(address,uint256,uint256,address)",
    initializationParams
  );

  if (decodedParams == null) {
    log.info("Failed to decode initialization params", []);
    return;
  }

  log.info("decoded params {}", [decodedParams.toString()]);

  // if (decodedParams[0] &&  decodedParams[0].kind == JSONValueKind.STRING) {

  // let cookieToken = decodedParams[0].toAddress();
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
  log.info("OwnershipTransferred event: {}", [
    event.transaction.hash.toHexString(),
  ]);
}

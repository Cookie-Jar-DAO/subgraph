import { JSONValueKind, json } from "@graphprotocol/graph-ts";
import {
  DonationReceived,
  OwnershipTransferred,
  SummonCookieJar,
} from "../generated/CookieJarFactory/CookieJarFactory";
import { CookieJar } from "../generated/schema";
import { loadOrCreateCookieJar } from "./utils/cookieUtils";
import { log } from "matchstick-as";
import { CookieJarTemplate } from "../generated/templates";

export function handleSummonCookieJar(event: SummonCookieJar): void {
  log.info("summoned Cookie Jar: {} {}", [event.params.cookieJar.toHexString(), event.address.toHexString()]);

  let jar = loadOrCreateCookieJar(event.params.cookieJar);
  let details = json.fromString(event.params.details);

  if (details.kind == JSONValueKind.OBJECT) {
    let obj = details.toObject();
    let typeVal = obj.get("type");
    let nameVal = obj.get("name");
    let descriptionVal = obj.get("description");
    let linkVal = obj.get("link");

    if (typeVal && typeVal.kind == JSONValueKind.STRING) {
      jar.type = typeVal.toString();
    }
    if (nameVal && nameVal.kind == JSONValueKind.STRING) {
      jar.name = nameVal.toString();
    }
    if (descriptionVal && descriptionVal.kind == JSONValueKind.STRING) {
      jar.description = descriptionVal.toString();
    }
    if (linkVal && linkVal.kind == JSONValueKind.STRING) {
      jar.link = linkVal.toString();
    }
  }
  jar.owner = event.transaction.from;

  jar.save();

  CookieJarTemplate.create(event.params.cookieJar);
  log.info("template created: {}", [event.params.cookieJar.toHexString()]);
}

export function handleDonationReceived(event: DonationReceived): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let cookieJar = CookieJar.load(event.transaction.from);

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!cookieJar) {
    cookieJar = new CookieJar(event.transaction.from);
  }

  cookieJar.save();
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

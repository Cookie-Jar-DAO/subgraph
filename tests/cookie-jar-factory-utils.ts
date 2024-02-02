import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  DonationReceived,
  OwnershipTransferred,
  SummonCookieJar
} from "../generated/CookieJarFactory/CookieJarFactory"

export function createDonationReceivedEvent(
  donationToken: Address,
  donationAmount: BigInt
): DonationReceived {
  let donationReceivedEvent = changetype<DonationReceived>(newMockEvent())

  donationReceivedEvent.parameters = new Array()

  donationReceivedEvent.parameters.push(
    new ethereum.EventParam(
      "donationToken",
      ethereum.Value.fromAddress(donationToken)
    )
  )
  donationReceivedEvent.parameters.push(
    new ethereum.EventParam(
      "donationAmount",
      ethereum.Value.fromUnsignedBigInt(donationAmount)
    )
  )

  return donationReceivedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createSummonCookieJarEvent(
  cookieJar: Address,
  initializer: Bytes,
  details: string,
  uid: string
): SummonCookieJar {
  let summonCookieJarEvent = changetype<SummonCookieJar>(newMockEvent())

  summonCookieJarEvent.parameters = new Array()

  summonCookieJarEvent.parameters.push(
    new ethereum.EventParam("cookieJar", ethereum.Value.fromAddress(cookieJar))
  )
  summonCookieJarEvent.parameters.push(
    new ethereum.EventParam(
      "initializer",
      ethereum.Value.fromBytes(initializer)
    )
  )
  summonCookieJarEvent.parameters.push(
    new ethereum.EventParam("details", ethereum.Value.fromString(details))
  )
  summonCookieJarEvent.parameters.push(
    new ethereum.EventParam("uid", ethereum.Value.fromString(uid))
  )

  return summonCookieJarEvent
}

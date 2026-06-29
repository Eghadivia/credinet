"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Copy, User } from "lucide-react";
import { NetworkProvider } from "@/types/airtime";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { User03Icon, UserMultiple02Icon } from "@hugeicons/core-free-icons";
import { useEffect, useState } from "react";
import { useCurrentUser } from "@/queries/auth";

interface EnterPhoneStepProps {
  selectedProvider: NetworkProvider;
  onChangeProvider: () => void;
  phoneNumber: string;
  onPhoneChange: (phone: string) => void;
  recipientType: "self" | "others";
  onRecipientTypeChange: (type: "self" | "others") => void;
  onContinue: () => void;
  isLoading?: boolean;
}

export default function EnterPhoneStep({
  selectedProvider,
  onChangeProvider,
  phoneNumber,
  onPhoneChange,
  recipientType,
  onRecipientTypeChange,
  onContinue,
  isLoading = false,
}: EnterPhoneStepProps) {
  // const registeredNumber = "+234 802 345 0789";

  const [copied, setCopied] = useState(false);
  const { data: user } = useCurrentUser();

  const userPhone = user?.phone || "";
  const registeredNumber = userPhone;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(registeredNumber.replace(/\s/g, ""));
    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  };

 useEffect(() => {
  if (recipientType === "self" && userPhone) {
    const clean = userPhone.replace("+234", "").trim();
    onPhoneChange(clean);
  }

  if (recipientType === "others") {
    onPhoneChange("");
  }
}, [recipientType, userPhone]);

  return (
    <div className="flex items-start justify-center py-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-[32px] border border-[#f0eeee] bg-white shadow-[0_18px_50px_rgba(23,23,23,0.04)]">
        <div className="bg-[#fff8fb] px-5 py-4 flex items-center justify-between border-b border-[#f0eeee]">
          <div className="flex items-center gap-3">
            <div className="bg-white w-10 h-10 flex items-center justify-center rounded-xl">
              <Image
                src={"/network-logo.png"}
                alt={selectedProvider.name}
                width={20}
                height={19}
                className="object-contain"
              />
            </div>
            <div>
              <p className="text-[10.5px] font-black tracking-[0.14em] text-[#9b95a3] uppercase">
                Network Provider
              </p>
              <p className="font-black text-[#171717] text-base">
                {selectedProvider.name}
              </p>
            </div>
          </div>

          <button
            onClick={onChangeProvider}
            className="text-[#f45ca0] text-sm font-black hover:text-[#ee1c25] cursor-pointer"
          >
            Change
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Title */}
          <div>
            <h2 className="text-3xl font-black tracking-[-0.04em] text-[#171717] sm:text-4xl">
              Enter Phone Number
            </h2>
            <p className="text-base text-[#77777c] mt-3">
              Provide the recipient's mobile number for the airtime recharge.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex bg-[#f7f7f8] rounded-2xl p-2">
            <button
              onClick={() => onRecipientTypeChange("self")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-semibold transition cursor-pointer ${
                recipientType === "self"
                  ? "bg-white text-[#ee1c25] shadow-sm"
                  : "text-[#77777c]"
              }`}
            >
              <HugeiconsIcon icon={User03Icon} className="w-4 h-4" />
              <span>Self-Recharge</span>
            </button>

            <button
              onClick={() => onRecipientTypeChange("others")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-semibold transition cursor-pointer ${
                recipientType === "others"
                  ? "bg-white text-[#ee1c25] shadow-sm"
                  : "text-[#77777c]"
              }`}
            >
              <HugeiconsIcon icon={UserMultiple02Icon} className="w-4 h-4" />
              <span>Send to Others</span>
            </button>
          </div>

          {/* Phone Input */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2">
              Phone Number
            </label>

            <div>
              {recipientType === "self" ? (
                // ✅ SELF MODE (FULL LOCKED NUMBER)
                <input
                  type="text"
                  value={user?.phone || ""}
                  disabled
                  className="w-full mt-2 bg-[#f7f7f8] text-gray-500 rounded-2xl px-4 py-3 text-sm"
                />
              ) : (
                // ✅ OTHERS MODE (EDITABLE)
                <div className="mt-2 flex items-center bg-[#f7f7f8] rounded-2xl px-4">
                  <span className="text-sm font-semibold text-gray-700 mr-2">
                    +234
                  </span>

                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => onPhoneChange(e.target.value)}
                    placeholder="0800 000 0000"
                    className="flex-1 bg-transparent outline-none py-3 text-sm"
                  />

                  <button
                    onClick={handleCopy}
                    className="p-2 rounded-md hover:bg-gray-200 transition"
                  >
                    <Copy className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              )}

              {recipientType === "self" && (
                <p className="text-xs text-gray-400 mt-3">
                  Your registered number:{" "}
                  <span className="text-gray-700 font-medium">
                    {user?.phone}
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Button */}
          <Button
            onClick={onContinue}
            disabled={!phoneNumber || isLoading}
            className="h-[52px] bg-gradient-to-r from-[#ff6b68] via-[#f45ca0] to-[#a855f7] hover:opacity-95 text-white py-3 text-base w-full cursor-pointer rounded-full font-black transition disabled:bg-gray-300"
          >
            Continue <ArrowRight />
          </Button>
        </div>
      </div>
    </div>
  );
}

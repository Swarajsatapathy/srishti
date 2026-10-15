"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { getImageUrl } from "@/lib/imageUrl";

type Reporter = {
  _id: string;
  reporterId?: string;
  name: string;
  designation: string;
  district?: string;
  phoneNumber?: string;
  bloodGroup?: string;
  validUpto?: string;
  photo?: {
    url?: string;
    key?: string;
  };
};

type ReporterIdCardDownloadProps = {
  reporter: Reporter;
};

const formatValidDate = (dateValue?: string) => {
  if (!dateValue) {
    return "Not Updated";
  }

  const dateOnly = dateValue.split("T")[0];
  const [year, month, day] = dateOnly.split("-").map(Number);

  if (!year || !month || !day) {
    return dateValue;
  }

  const date = new Date(Date.UTC(year, month - 1, day));
  const dayStr = String(day).padStart(2, "0");
  const monthStr = new Intl.DateTimeFormat("en-US", {
    month: "short",
    timeZone: "UTC",
  }).format(date).toUpperCase();

  return `${dayStr} ${monthStr}, ${year}`;
};

const formatBloodGroup = (bg?: string) => {
  if (!bg) return null;
  const trimmed = bg.trim().toUpperCase();
  const match = trimmed.match(/^([A-Z]+)\s*([+-]?)$/);
  if (match) {
    return {
      type: match[1],
      rh: match[2] || "",
    };
  }
  return { type: trimmed, rh: "" };
};

const createFileName = (name: string, reporterId?: string) => {
  const safeName = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const safeReporterId = reporterId
    ?.trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return safeReporterId
    ? `srishti-news-${safeName}-${safeReporterId}.png`
    : `srishti-news-${safeName}-id-card.png`;
};

const waitForCardImages = async (node: HTMLElement) => {
  const images = Array.from(node.querySelectorAll("img"));

  await Promise.all(
    images.map(
      (image) =>
        new Promise<void>((resolve, reject) => {
          if (image.complete && image.naturalWidth > 0) {
            resolve();
            return;
          }

          if (image.complete && image.naturalWidth === 0) {
            reject(new Error(`Unable to load image: ${image.src}`));
            return;
          }

          const handleLoad = () => {
            cleanup();
            resolve();
          };

          const handleError = () => {
            cleanup();
            reject(new Error(`Unable to load image: ${image.src}`));
          };

          const cleanup = () => {
            image.removeEventListener("load", handleLoad);
            image.removeEventListener("error", handleError);
          };

          image.addEventListener("load", handleLoad);
          image.addEventListener("error", handleError);
        })
    )
  );
};

export default function ReporterIdCardDownload({
  reporter,
}: ReporterIdCardDownloadProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");

  const reporterPhotoUrl = getImageUrl(reporter.photo?.url);

  const reporterInitials = reporter.name
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleDownload = async () => {
    const card = cardRef.current;

    if (!card || isDownloading) {
      return;
    }

    setIsDownloading(true);
    setDownloadError("");

    try {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      await waitForCardImages(card);

      // Allow the browser to complete layout before capture
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve());
      });

      const dataUrl = await toPng(card, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
        cacheBust: true,
        skipFonts: true,
      });

      const downloadLink = document.createElement("a");
      downloadLink.download = createFileName(
        reporter.name,
        reporter.reporterId
      );
      downloadLink.href = dataUrl;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to generate the ID card image.";

      console.error("Unable to download reporter ID card:", {
        error,
        message,
        reporterPhotoUrl,
      });

      setDownloadError(
        `${message} Check whether the reporter photo is accessible from the browser.`
      );
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      {/* Only this button is visible on the reporter page */}
      <div className="reporterIdDownloadOnly">
        <button
          type="button"
          onClick={handleDownload}
          disabled={isDownloading}
          className="reporterIdDownloadButton bg-primary hover:bg-primary-dark transition-all duration-200"
          style={{
            backgroundColor: "#D9531E",
            color: "#ffffff",
          }}
          onMouseEnter={(e) => {
            if (!isDownloading) e.currentTarget.style.backgroundColor = "#B83D04";
          }}
          onMouseLeave={(e) => {
            if (!isDownloading) e.currentTarget.style.backgroundColor = "#D9531E";
          }}
        >
          {isDownloading ? "Preparing ID Card..." : "Download ID Card"}
        </button>

        {downloadError && (
          <p className="reporterIdDownloadError">
            {downloadError}
          </p>
        )}
      </div>

      {/* Off-screen card used only for PNG generation */}
      <div
        className="reporterIdCardCaptureArea"
        aria-hidden="true"
      >
        <div
          ref={cardRef}
          className="idCardPortrait"
        >
          {/* Background Decorative Graphic Overlay */}
          <svg
            className="idCardPortraitBgSvg"
            viewBox="0 0 591 1004"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            {/* Subtle polygonal watermark facets */}
            <g opacity="0.38">
              <polygon points="0,320 200,480 0,580" fill="#f1f5f9" />
              <polygon points="0,580 260,680 0,790" fill="#e2e8f0" opacity="0.6" />
              <polygon points="200,480 430,550 260,680" fill="#f8fafc" />
              <polygon points="430,550 591,440 480,660" fill="#f1f5f9" opacity="0.5" />
              <polygon points="260,680 480,660 360,860" fill="#e2e8f0" opacity="0.5" />
              <polygon points="0,790 260,680 160,930" fill="#f8fafc" />
              <polygon points="360,860 591,760 460,940" fill="#f1f5f9" opacity="0.4" />
            </g>

            {/* Top Right warm ambient arc */}
            <path
              d="M160 0 C320 35 480 30 591 10 L591 0 Z"
              fill="#fed7aa"
              opacity="0.45"
            />
            <path
              d="M260 0 C400 25 500 20 591 0 Z"
              fill="#fde68a"
              opacity="0.35"
            />

            {/* Top Left sweeping orange ribbon */}
            <path
              d="M0 0 L320 0 C220 50 140 120 78 240 C35 320 32 400 32 445 C15 448 0 435 0 410 Z"
              fill="#ea580c"
            />
            <path
              d="M0 0 L270 0 C180 40 110 100 55 200 C15 280 0 350 0 390 Z"
              fill="#f97316"
            />

            {/* Top Left green vertical capsule */}
            <rect x="32" y="0" width="46" height="300" rx="23" fill="#15803d" />

            {/* Top Left orange outer border strip */}
            <rect x="0" y="0" width="32" height="445" rx="16" fill="#f97316" />

            {/* Bottom Right orange vertical pillar */}
            <rect x="522" y="626" width="69" height="378" rx="34.5" fill="#f97316" />

            {/* Bottom light green wave */}
            <path
              d="M0 975 Q220 955 420 985 Q490 995 540 1004 L0 1004 Z"
              fill="#86efac"
            />

            {/* Bottom deep forest green swooping wave */}
            <path
              d="M0 978 C160 978 320 972 420 968 C490 962 540 910 591 855 L591 1004 L0 1004 Z"
              fill="#15803d"
            />
          </svg>

          {/* Diagonal Background Watermark Logo */}
          <div
            className="idCardPortraitWatermark"
            style={{
              position: "absolute",
              top: "54%",
              left: "50%",
              transform: "translate(-50%, -50%) rotate(-30deg)",
              width: "430px",
              opacity: 0.08,
              pointerEvents: "none",
              zIndex: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src="/id-card-logo.png"
              alt=""
              style={{
                display: "block",
                width: "100%",
                height: "auto",
                objectFit: "contain",
              }}
            />
          </div>

          {/* Top Logo */}
          <div className="idCardPortraitLogoWrapper">
            <img
              src="/id-card-logo.png"
              alt="Srishti News"
              className="idCardPortraitLogo"
            />
          </div>

          {/* Photo and Blood Group Row */}
          <div className="idCardPortraitPhotoRow">
            <div className="idCardPortraitBloodGroup">
              {(() => {
                const bg = formatBloodGroup(reporter.bloodGroup);
                if (!bg) return null;
                return (
                  <>
                    <img
                      src="/blood-drop.png"
                      alt="Blood Group"
                      className="idCardPortraitBloodDrop"
                      style={{
                        width: "30px",
                        height: "auto",
                        display: "block",
                        filter:
                          "drop-shadow(0 2px 4px rgba(185, 28, 28, 0.28))",
                      }}
                    />
                    <div
                      className="idCardPortraitBloodText"
                      style={{
                        display: "inline-flex",
                        alignItems: "flex-start",
                        justifyContent: "center",
                        fontFamily: '"Times New Roman", Times, serif',
                        fontWeight: 700,
                        color: "#991b1b",
                        lineHeight: 1,
                        marginTop: "5px",
                        letterSpacing: "0.5px",
                      }}
                    >
                      <span style={{ fontSize: "22px", fontWeight: 700 }}>
                        {bg.type}
                      </span>
                      {bg.rh && (
                        <span
                          style={{
                            fontSize: "16px",
                            fontWeight: 700,
                            marginLeft: "2px",
                            transform: "translateY(-3px)",
                            color: "#dc2626",
                          }}
                        >
                          {bg.rh}
                        </span>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>

            <div
              className="idCardPortraitPhotoFrame"
              style={{
                width: "210px",
                height: "265px",
                borderRadius: "8px",
                overflow: "hidden",
                background: "#f1f5f9",
                border: "2px solid #2563eb",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.12)",
                flexShrink: 0,
                boxSizing: "border-box",
              }}
            >
              {reporterPhotoUrl ? (
                <img
                  src={reporterPhotoUrl}
                  alt={reporter.name}
                  className="idCardPortraitPhoto"
                  crossOrigin="anonymous"
                  style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "top",
                  }}
                />
              ) : (
                <div
                  className="idCardPortraitPhotoFallback"
                  style={{
                    display: "flex",
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#15803d",
                    color: "#ffffff",
                    fontSize: "54px",
                    fontWeight: 900,
                  }}
                >
                  {reporterInitials || "SN"}
                </div>
              )}
            </div>

            {/* Vertical PRESS Banner aligned with Photo */}
            <div
              className="idCardPortraitPress"
              style={{
                position: "absolute",
                right: "98px",
                top: "50%",
                transform: "translateY(-50%) scaleX(1.18)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
                fontFamily: '"Arial Black", Gadget, sans-serif',
                fontSize: "38px",
                fontWeight: 900,
                color: "#dc2626",
                lineHeight: 1,
                userSelect: "none",
              }}
            >
              <span>P</span>
              <span>R</span>
              <span>E</span>
              <span>S</span>
              <span>S</span>
            </div>
          </div>

          {/* Name & Designation */}
          <div className="idCardPortraitIdentity">
            <h1 className="idCardPortraitName">{reporter.name}</h1>
            <h2 className="idCardPortraitDesignation">
              {reporter.designation || "District Correspondent"}
            </h2>
          </div>

          {/* Details Table */}
          <div
            className="idCardPortraitDetails"
            style={{
              position: "relative",
              zIndex: 5,
              width: "410px",
              margin: "18px auto 0",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              className="idCardPortraitDetailRow"
              style={{
                display: "grid",
                gridTemplateColumns: "125px 20px 1fr",
                alignItems: "center",
                padding: "6px 0",
              }}
            >
              <span
                className="idCardPortraitLabel"
                style={{ fontSize: "19px", fontWeight: 900, color: "#b91c1c" }}
              >
                ID No
              </span>
              <span
                className="idCardPortraitColon"
                style={{
                  fontSize: "19px",
                  fontWeight: 900,
                  color: "#1a365d",
                  textAlign: "center",
                }}
              >
                :
              </span>
              <span
                className="idCardPortraitValue"
                style={{ fontSize: "19px", fontWeight: 800, color: "#1a365d" }}
              >
                {reporter.reporterId || "Not Assigned"}
              </span>
            </div>

            {/* Separating line 1 */}
            <div
              style={{
                height: "1.5px",
                backgroundColor: "#cbd5e1",
                width: "100%",
                margin: "2px 0",
              }}
            />

            <div
              className="idCardPortraitDetailRow"
              style={{
                display: "grid",
                gridTemplateColumns: "125px 20px 1fr",
                alignItems: "center",
                padding: "6px 0",
              }}
            >
              <span
                className="idCardPortraitLabel"
                style={{ fontSize: "19px", fontWeight: 900, color: "#b91c1c" }}
              >
                District
              </span>
              <span
                className="idCardPortraitColon"
                style={{
                  fontSize: "19px",
                  fontWeight: 900,
                  color: "#1a365d",
                  textAlign: "center",
                }}
              >
                :
              </span>
              <span
                className="idCardPortraitValue"
                style={{ fontSize: "19px", fontWeight: 800, color: "#1a365d" }}
              >
                {reporter.district || "Odisha"}
              </span>
            </div>

            {/* Separating line 2 */}
            <div
              style={{
                height: "1.5px",
                backgroundColor: "#cbd5e1",
                width: "100%",
                margin: "2px 0",
              }}
            />

            <div
              className="idCardPortraitDetailRow"
              style={{
                display: "grid",
                gridTemplateColumns: "125px 20px 1fr",
                alignItems: "center",
                padding: "6px 0",
              }}
            >
              <span
                className="idCardPortraitLabel"
                style={{ fontSize: "19px", fontWeight: 900, color: "#b91c1c" }}
              >
                Mobile
              </span>
              <span
                className="idCardPortraitColon"
                style={{
                  fontSize: "19px",
                  fontWeight: 900,
                  color: "#1a365d",
                  textAlign: "center",
                }}
              >
                :
              </span>
              <span
                className="idCardPortraitValue"
                style={{ fontSize: "19px", fontWeight: 800, color: "#1a365d" }}
              >
                {reporter.phoneNumber || "Not Updated"}
              </span>
            </div>

            {/* Separating line 3 */}
            <div
              style={{
                height: "1.5px",
                backgroundColor: "#cbd5e1",
                width: "100%",
                margin: "2px 0",
              }}
            />

            <div
              className="idCardPortraitDetailRow"
              style={{
                display: "grid",
                gridTemplateColumns: "125px 20px 1fr",
                alignItems: "center",
                padding: "6px 0",
              }}
            >
              <span
                className="idCardPortraitLabel"
                style={{ fontSize: "19px", fontWeight: 900, color: "#b91c1c" }}
              >
                Validity
              </span>
              <span
                className="idCardPortraitColon"
                style={{
                  fontSize: "19px",
                  fontWeight: 900,
                  color: "#1a365d",
                  textAlign: "center",
                }}
              >
                :
              </span>
              <span
                className="idCardPortraitValue"
                style={{ fontSize: "19px", fontWeight: 800, color: "#1a365d" }}
              >
                {formatValidDate(reporter.validUpto)}
              </span>
            </div>

            {/* Separating line under Validity */}
            <div
              style={{
                height: "1.5px",
                backgroundColor: "#cbd5e1",
                width: "100%",
                margin: "2px 0",
              }}
            />
          </div>

          {/* QR Code and Issuing Authority Row */}
          <div
            className="idCardPortraitBottomRow"
            style={{
              position: "relative",
              zIndex: 5,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              width: "460px",
              margin: "24px auto 0",
            }}
          >
            <div
              className="idCardPortraitQrFrame"
              style={{
                width: "98px",
                height: "98px",
                background: "#ffffff",
                padding: "3px",
                border: "2px solid #e2e8f0",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxSizing: "border-box",
              }}
            >
              <img
                src="/srishti-qr.png"
                alt="Verification QR Code"
                className="idCardPortraitQr"
                style={{
                  display: "block",
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </div>

            <div
              className="idCardPortraitAuthority"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                marginBottom: "28px",
                marginRight: "16px",
              }}
            >
              <span
                className="idCardPortraitAuthTitle"
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#2563eb",
                  letterSpacing: "0.3px",
                }}
              >
                Issuing Authority
              </span>
              <span
                className="idCardPortraitAuthName"
                style={{
                  fontSize: "20px",
                  fontWeight: 900,
                  color: "#b91c1c",
                  marginTop: "3px",
                  lineHeight: 1.1,
                }}
              >
                Manoj Satapathy
              </span>
              <span
                className="idCardPortraitAuthRole"
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "#1a365d",
                  marginTop: "2px",
                }}
              >
                Founder Editor
              </span>
            </div>
          </div>

          {/* Footer Registration & Contact info */}
          <div
            className="idCardPortraitFooter"
            style={{
              position: "relative",
              zIndex: 5,
              textAlign: "center",
              marginTop: "18px",
            }}
          >
            <p
              className="idCardPortraitRni"
              style={{
                fontSize: "14px",
                fontWeight: 700,
                color: "#b91c1c",
                margin: 0,
                lineHeight: 1.35,
                letterSpacing: "0.3px",
              }}
            >
              RNI Regd. No.: ODIODI/2011/40163
            </p>
            <p
              className="idCardPortraitContact"
              style={{
                fontSize: "14.5px",
                fontWeight: 700,
                color: "#1a365d",
                margin: "2px 0 0",
                lineHeight: 1.35,
              }}
            >
              www.srishtinews.in
            </p>
            <p
              className="idCardPortraitContact"
              style={{
                fontSize: "14.5px",
                fontWeight: 700,
                color: "#1a365d",
                margin: "2px 0 0",
                lineHeight: 1.35,
              }}
            >
              srishtinews@gmail.com
            </p>
            <p
              className="idCardPortraitContact"
              style={{
                fontSize: "14.5px",
                fontWeight: 700,
                color: "#1a365d",
                margin: "2px 0 0",
                lineHeight: 1.35,
              }}
            >
              +91 96684 21545
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
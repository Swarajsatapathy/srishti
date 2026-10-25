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

// Generate authentic guilloche security waves for banknote / ID card pattern
const generateGuillochePaths = (): string[] => {
  const paths: string[] = [];
  const width = 591;

  // 1. Dual-frequency horizontal sinusoidal wave bands with counter-phases (creates diamond moiré security netting)
  for (let y = 45; y <= 955; y += 20) {
    const freq1 = 0.016;
    const freq2 = 0.034;
    const amp1 = 9;
    const amp2 = 4.5;
    const phase = (y / 1004) * Math.PI * 4;

    let d1 = `M 38 ${y.toFixed(1)}`;
    for (let x = 45; x <= width - 38; x += 15) {
      const dy =
        Math.sin(x * freq1 + phase) * amp1 +
        Math.cos(x * freq2 + phase * 0.5) * amp2;
      d1 += ` L ${x} ${(y + dy).toFixed(1)}`;
    }
    paths.push(d1);

    let d2 = `M 38 ${y.toFixed(1)}`;
    for (let x = 45; x <= width - 38; x += 15) {
      const dy =
        Math.sin(x * freq1 - phase) * amp1 -
        Math.cos(x * freq2 - phase * 0.5) * amp2;
      d2 += ` L ${x} ${(y + dy).toFixed(1)}`;
    }
    paths.push(d2);
  }

  // 2. Lateral sweeping security arcs radiating inward from left and right margins
  for (let r = 70; r <= 360; r += 22) {
    paths.push(
      `M 38 ${(500 - r * 0.72).toFixed(1)} Q ${(38 + r * 0.55).toFixed(1)} 500 38 ${(500 + r * 0.72).toFixed(1)}`
    );
    paths.push(
      `M ${width - 38} ${(500 - r * 0.72).toFixed(1)} Q ${(width - 38 - r * 0.55).toFixed(1)} 500 ${width - 38} ${(500 + r * 0.72).toFixed(1)}`
    );
  }

  return paths;
};

const GUILLOCHE_PATHS = generateGuillochePaths();

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

  const bgInfo = formatBloodGroup(reporter.bloodGroup);

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
          <p className="reporterIdDownloadError">{downloadError}</p>
        )}
      </div>

      {/* Off-screen card used only for PNG generation */}
      <div className="reporterIdCardCaptureArea" aria-hidden="true">
        <div ref={cardRef} className="idCardPortrait">
          {/* Vector Background Graphic: Guilloche, Watermark, Borders & Corners */}
          <svg
            className="idCardPortraitBgSvg"
            viewBox="0 0 591 1004"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            {/* Base ivory card background */}
            <rect width="591" height="1004" rx="24" fill="#FAF8F2" />

            {/* Guilloche security wavy linework pattern */}
            <g stroke="#4f6c56" strokeWidth="0.75" opacity="0.14" fill="none">
              {GUILLOCHE_PATHS.map((d, index) => (
                <path key={index} d={d} />
              ))}
            </g>

            {/* Subtle central watermark text behind details */}
            <g opacity="0.065" pointerEvents="none">
              <text
                x="295"
                y="545"
                textAnchor="middle"
                fontFamily="Arial, Helvetica, sans-serif"
                fontWeight="900"
                fontSize="56"
                fill="#3b5242"
                letterSpacing="4"
              >
                SRISHTI
              </text>
              <text
                x="295"
                y="600"
                textAnchor="middle"
                fontFamily="'Times New Roman', Georgia, serif"
                fontWeight="900"
                fontSize="46"
                fill="#3b5242"
                letterSpacing="6"
              >
                NEWS
              </text>
            </g>

            {/* Outer dark forest green card border */}
            <rect
              x="12"
              y="12"
              width="567"
              height="980"
              rx="20"
              ry="20"
              fill="none"
              stroke="#0e3e2e"
              strokeWidth="4.5"
            />

            {/* Inner gold hairline border */}
            <rect
              x="20"
              y="20"
              width="551"
              height="964"
              rx="14"
              ry="14"
              fill="none"
              stroke="#b88d3b"
              strokeWidth="1.3"
            />

            {/* Left dark vertical column */}
            <path
              d="M 23 36 L 23 968 L 38 968 L 38 36 Z"
              fill="#0a3233"
            />

            {/* Left vertical gold pinstripe */}
            <line
              x1="42"
              y1="20"
              x2="42"
              y2="984"
              stroke="#b88d3b"
              strokeWidth="1.3"
            />

            {/* Bottom-Left Corner Accent Fold */}
            <g id="bottomLeftCorner">
              <path
                d="M 12 920 L 78 986 L 78 1004 L 24 1004 Q 12 1004 12 992 Z"
                fill="#0e3e2e"
              />
              <line
                x1="12"
                y1="920"
                x2="78"
                y2="986"
                stroke="#e0a93b"
                strokeWidth="2.5"
              />
              <polygon
                points="32,1004 90,946 122,976 86,1004"
                fill="#d9531e"
              />
              <polygon
                points="32,1004 62,968 90,988 74,1004"
                fill="#e86522"
              />
              <line
                x1="32"
                y1="1004"
                x2="122"
                y2="976"
                stroke="#e0a93b"
                strokeWidth="1.5"
              />
            </g>

            {/* Bottom-Right Corner Accent Fold */}
            <g id="bottomRightCorner">
              <path
                d="M 579 920 L 513 986 L 513 1004 L 567 1004 Q 579 1004 579 992 Z"
                fill="#0e3e2e"
              />
              <line
                x1="579"
                y1="920"
                x2="513"
                y2="986"
                stroke="#e0a93b"
                strokeWidth="2.5"
              />
              <polygon
                points="559,1004 501,946 469,976 505,1004"
                fill="#d9531e"
              />
              <polygon
                points="559,1004 529,968 501,988 517,1004"
                fill="#e86522"
              />
              <line
                x1="559"
                y1="1004"
                x2="469"
                y2="976"
                stroke="#e0a93b"
                strokeWidth="1.5"
              />
              {/* Star sparkle on right accent */}
              <path
                d="M 545 943 Q 545 955 557 955 Q 545 955 545 967 Q 545 955 533 955 Q 545 955 545 943 Z"
                fill="#edf7f0"
              />
              <circle cx="545" cy="955" r="1.5" fill="#ffffff" />
            </g>
          </svg>

          {/* Top Logo */}
          <div className="idCardPortraitLogoWrapper">
            <img
              src="/id-card-logo.png"
              alt="Srishti News"
              className="idCardPortraitLogo"
            />
          </div>

          {/* Photo and Flanking Badges Row */}
          <div className="idCardPortraitPhotoRow">
            {/* Left: Blood Group */}
            <div className="idCardPortraitBloodGroup">
              {bgInfo && (
                <>
                  <img
                    src="/blood-drop.png"
                    alt="Blood Group"
                    className="idCardPortraitBloodDrop"
                  />
                  <div className="idCardPortraitBloodText">
                    <span>{bgInfo.type}</span>
                    {bgInfo.rh && (
                      <span
                        style={{
                          fontSize: "16px",
                          fontWeight: 700,
                          marginLeft: "1px",
                          transform: "translateY(-4px)",
                          color: "#8b1515",
                        }}
                      >
                        {bgInfo.rh}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Center: Photo Frame */}
            <div className="idCardPortraitPhotoFrame">
              {reporterPhotoUrl ? (
                <img
                  src={reporterPhotoUrl}
                  alt={reporter.name}
                  className="idCardPortraitPhoto"
                  crossOrigin="anonymous"
                />
              ) : (
                <div className="idCardPortraitPhotoFallback">
                  {reporterInitials || "SN"}
                </div>
              )}
            </div>

            {/* Right: Vertical PRESS Banner with Ornamental Flourishes */}
            <div className="idCardPortraitPress">
              {/* Top Ornamental Flourish */}
              <svg
                width="40"
                height="12"
                viewBox="0 0 40 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line
                  x1="2"
                  y1="6"
                  x2="15"
                  y2="6"
                  stroke="#b88d3b"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
                <polygon points="20,1 25,6 20,11 15,6" fill="#b88d3b" />
                <line
                  x1="25"
                  y1="6"
                  x2="38"
                  y2="6"
                  stroke="#b88d3b"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>

              <span>P</span>
              <span>R</span>
              <span>E</span>
              <span>S</span>
              <span>S</span>

              {/* Bottom Ornamental Flourish */}
              <svg
                width="40"
                height="12"
                viewBox="0 0 40 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line
                  x1="2"
                  y1="6"
                  x2="15"
                  y2="6"
                  stroke="#b88d3b"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
                <polygon points="20,1 25,6 20,11 15,6" fill="#b88d3b" />
                <line
                  x1="25"
                  y1="6"
                  x2="38"
                  y2="6"
                  stroke="#b88d3b"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* Reporter Identity (Name & Designation) */}
          <div className="idCardPortraitIdentity">
            <h1 className="idCardPortraitName">{reporter.name}</h1>
            <h2
              className="idCardPortraitDesignation"
              style={{ fontWeight: 800 }}
            >
              {reporter.designation || "District Correspondent"}
            </h2>
          </div>

          {/* Details Table: ID No, District, Mobile, Validity */}
          <div className="idCardPortraitDetails">
            {/* Row 1: ID No */}
            <div className="idCardPortraitDetailRow">
              <span className="idCardPortraitLabel">ID No</span>
              <span className="idCardPortraitColon">:</span>
              <span className="idCardPortraitValue">
                {reporter.reporterId || "Not Assigned"}
              </span>
            </div>
            <div className="idCardPortraitDetailDivider" />

            {/* Row 2: District */}
            <div className="idCardPortraitDetailRow">
              <span className="idCardPortraitLabel">District</span>
              <span className="idCardPortraitColon">:</span>
              <span className="idCardPortraitValue">
                {reporter.district || "Odisha"}
              </span>
            </div>
            <div className="idCardPortraitDetailDivider" />

            {/* Row 3: Mobile */}
            <div className="idCardPortraitDetailRow">
              <span className="idCardPortraitLabel">Mobile</span>
              <span className="idCardPortraitColon">:</span>
              <span className="idCardPortraitValue">
                {reporter.phoneNumber || "Not Updated"}
              </span>
            </div>
            <div className="idCardPortraitDetailDivider" />

            {/* Row 4: Validity */}
            <div className="idCardPortraitDetailRow">
              <span className="idCardPortraitLabel">Validity</span>
              <span className="idCardPortraitColon">:</span>
              <span className="idCardPortraitValue">
                {formatValidDate(reporter.validUpto)}
              </span>
            </div>
            <div className="idCardPortraitDetailDivider" />
          </div>

          {/* Verification QR Code and Issuing Authority Row */}
          <div className="idCardPortraitBottomRow">
            <div className="idCardPortraitQrFrame">
              <img
                src="/srishti-qr.png"
                alt="Verification QR Code"
                className="idCardPortraitQr"
              />
            </div>

            <div className="idCardPortraitAuthority">
              <span className="idCardPortraitAuthTitle">Issuing Authority</span>
              <span className="idCardPortraitAuthName" style={{ color: "#800000" }}>
                Manoj Satapathy
              </span>
              <span className="idCardPortraitAuthRole">Founder Editor</span>
            </div>
          </div>

          {/* Footer Registration & Contact info */}
          <div className="idCardPortraitFooter">
            <p className="idCardPortraitRni">
              RNI Regd. No.: ODIODI/2011/40163
            </p>
            <p className="idCardPortraitContact">www.srishtinews.in</p>
            <p className="idCardPortraitContact">srishtinews@gmail.com</p>
            <p className="idCardPortraitContact">+91 96684 21545</p>
          </div>
        </div>
      </div>
    </>
  );
}
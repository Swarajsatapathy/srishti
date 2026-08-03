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

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
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

      // Allow the browser to complete the final layout before capture.
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve());
      });

      const dataUrl = await toPng(card, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#ffffff",

        // Do not append cache-busting parameters to S3 image URLs.
        cacheBust: false,

        // Prevent external font requests from breaking the conversion.
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
          className="reporterIdDownloadButton"
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
          className="reporterIdCard"
        >
          {/* Header */}
          <div className="reporterIdCardHeader">
            <div className="reporterIdLogoWrapper">
              <img
                src="/logo.png"
                alt="Srishti News logo"
                className="reporterIdLogo"
              />
            </div>

            <div className="reporterIdHeaderContent">
              <h2>Srishti News</h2>
              <p>Official Reporter Identity Card</p>
            </div>

            <div className="reporterIdHeaderMark">
              PRESS
            </div>
          </div>

          {/* Main body */}
          <div className="reporterIdCardBody">
            <div className="reporterIdPhotoColumn">
              <div className="reporterIdPhotoFrame">
                {reporterPhotoUrl ? (
                  <img
                    src={reporterPhotoUrl}
                    alt={reporter.name}
                    className="reporterIdPhoto"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <div className="reporterIdPhotoFallback">
                    {reporterInitials || "SN"}
                  </div>
                )}
              </div>

              <div className="reporterIdValidity">
                <span>Valid Up To</span>

                <strong>
                  {formatValidDate(reporter.validUpto)}
                </strong>
              </div>
            </div>

            <div className="reporterIdInformation">
              <h1>{reporter.name}</h1>

              <div className="reporterIdDetails">
                <div className="reporterIdDetailRow">
                  <span>Reporter ID</span>

                  <strong>
                    {reporter.reporterId || "Not Assigned"}
                  </strong>
                </div>

                <div className="reporterIdDetailRow">
                  <span>Designation</span>

                  <strong>
                    {reporter.designation || "Reporter"}
                  </strong>
                </div>

                <div className="reporterIdDetailRow">
                  <span>District</span>

                  <strong>
                    {reporter.district || "Not Updated"}
                  </strong>
                </div>
              </div>

              <div className="reporterIdSignature">
                <div className="reporterIdSignatureLine">
                  <span>-Sd-</span>
                </div>

                <strong>Manoj Satapathy</strong>
                <p>Srishti News</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="reporterIdCardFooter">
            <span>+91 96684 21545</span>

            <span className="reporterIdFooterDivider" />

            <span>srishtinews@gmail.com</span>

            <span className="reporterIdFooterDivider" />

            <span>www.srishtinews.in</span>
          </div>
        </div>
      </div>
    </>
  );
}
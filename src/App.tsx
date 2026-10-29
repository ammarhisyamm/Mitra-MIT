import { useEffect, useRef, useState } from "react";
import { Info } from "lucide-react";
import {
  ForgotDoneScreen,
  ForgotScreen,
  LoginScreen,
  OtpScreen,
  ResetPasswordScreen,
} from "@/screens/AuthScreens";
import {
  FaceCameraScreen,
  FaceCheckScreen,
  FaceFailedScreen,
  FaceIntroScreen,
  FaceProcessingScreen,
  FaceReviewScreen,
  PinCreateScreen,
  SplashScreen,
} from "@/screens/OnboardingScreens";
import {
  SuccessScreen,
  UnitHomeScreen,
  UnitScreen,
  VerifyChoiceScreen,
  VerifyPinScreen,
} from "@/screens/ResultScreens";
import {
  ActivityCheckinScreen,
  ActivityCheckoutScreen,
  ActivityCreatedScreen,
  ActivityDoneScreen,
  ActivityLeadsScreen,
  ActivityListScreen,
  ActivityScheduleScreen,
  ActivityTypeScreen,
} from "@/screens/ActivityScreens";
import { StatusBar } from "@/components/primitives";
import {
  defaultActivityName,
  defaultActivityTime,
  getUnit,
  screenLabel,
  type ActivityDraft,
  type ActivityLead,
  type BusinessUnit,
  type Mode,
  type Scenario,
  type Screen,
} from "@/lib/demo";

export default function App() {
  const [mode] = useState<Mode>("first");
  const [sessionActive, setSessionActive] = useState(true);
  const [scenario] = useState<Scenario>("normal");
  const [forceFaceFail] = useState(false);
  const [forceLoginFail] = useState(false);
  const [unit] = useState<BusinessUnit>("gmn");
  const [screen, setScreen] = useState<Screen>("checking");
  const [firstAccess, setFirstAccess] = useState(true);
  const [faceImage, setFaceImage] = useState<string | null>(null);
  const [lastMethod, setLastMethod] = useState<"face" | "pin">("face");
  const [runId, setRunId] = useState(0);
  const [notice, setNotice] = useState("");
  const [activityDraft, setActivityDraft] = useState<ActivityDraft>({
    kind: "kunjungan",
    area: "inside",
    name: defaultActivityName("kunjungan"),
    locationName: "Koperasi Mitra Binaan",
    address: "Jl. Fatmawati No. 12",
    village: "Cilandak Barat",
    region: "Kec. Cilandak, Jakarta Selatan, DKI Jakarta 12430",
    time: defaultActivityTime(),
  });
  const [activityCheckin, setActivityCheckin] = useState("09.42");
  const [activityLeads, setActivityLeads] = useState<ActivityLead[]>([]);
  const [activityCompleted, setActivityCompleted] = useState(false);
  const startConfig = useRef({ mode: "first" as Mode, sessionActive: true });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const config = startConfig.current;
    const timer = window.setTimeout(() => {
      setFirstAccess(config.mode === "first");
      if (config.mode === "returning" && config.sessionActive) {
        setScreen("home");
      } else {
        setScreen("login");
      }
    }, 1500);
    return () => window.clearTimeout(timer);
  }, [runId]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 3200);
    return () => window.clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    document.title = `MITRA · ${screenLabel(screen)}`;
    const timer = window.setTimeout(() => {
      const heading = scrollRef.current?.querySelector<HTMLElement>("h1");
      if (!heading) return;
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    }, 30);
    return () => window.clearTimeout(timer);
  }, [screen]);

  function startFlow(nextMode: Mode, nextSession: boolean) {
    startConfig.current = { mode: nextMode, sessionActive: nextSession };
    setScreen("checking");
    setFaceImage(null);
    setFirstAccess(nextMode === "first");
    setActivityLeads([]);
    setActivityCheckin("09.42");
    setActivityCompleted(false);
    setActivityDraft((current) => ({ ...current, time: defaultActivityTime() }));
    setRunId((current) => current + 1);
  }

  function loginSuccess() {
    if (scenario === "default-password") {
      setScreen("force-change");
      return;
    }
    setScreen(firstAccess ? "face-intro" : "verify-choice");
  }

  function faceDone() {
    setLastMethod("face");
    setScreen(firstAccess ? "pin-create" : "success");
  }

  function logout() {
    startFlow(mode, false);
    setSessionActive(false);
  }

  function renderScreen() {
    switch (screen) {
      case "checking":
        return <SplashScreen mode={mode} sessionActive={sessionActive} />;
      case "login":
        return (
          <LoginScreen
            onSuccess={loginSuccess}
            onForgot={() => setScreen("forgot")}
            forceFail={forceLoginFail}
          />
        );
      case "verify-choice":
        return (
          <VerifyChoiceScreen
            onFace={() => {
              setFaceImage(null);
              setScreen("face-intro");
            }}
            onPin={() => setScreen("verify-pin")}
            onLogout={logout}
          />
        );
      case "verify-pin":
        return (
          <VerifyPinScreen
            onSuccess={() => {
              setLastMethod("pin");
              setScreen("success");
            }}
            onBack={() => setScreen("verify-choice")}
            onUseFace={() => {
              setFaceImage(null);
              setScreen("face-intro");
            }}
            onForgotPin={() => {
              setSessionActive(false);
              setScreen("login");
            }}
          />
        );
      case "face-intro":
        return (
          <FaceIntroScreen
            onStart={() => {
              setFaceImage(null);
              setScreen("face-camera");
            }}
            onBack={() => setScreen(firstAccess ? "login" : "verify-choice")}
            allowPin={!firstAccess}
            enroll={firstAccess}
            onUsePin={() => setScreen("verify-pin")}
            onHelp={() =>
              setNotice("Hubungi admin unit untuk bantuan verifikasi wajah.")
            }
          />
        );
      case "face-camera":
        return (
          <FaceCameraScreen
            onCaptured={(image) => {
              setFaceImage(image);
              setScreen("face-processing");
            }}
            onBack={() => setScreen("face-intro")}
            onboarding={firstAccess}
          />
        );
      case "face-processing":
        return (
          <FaceProcessingScreen
            image={faceImage}
            onDone={() => setScreen("face-review")}
          />
        );
      case "face-review":
        return (
          <FaceReviewScreen
            image={faceImage}
            onUse={() => setScreen("face-check")}
            onRetake={() => {
              setFaceImage(null);
              setScreen("face-camera");
            }}
            onBack={() => setScreen("face-intro")}
            onboarding={firstAccess}
          />
        );
      case "face-check":
        return (
          <FaceCheckScreen
            image={faceImage}
            fail={forceFaceFail}
            onDone={faceDone}
            onFail={() => setScreen("face-failed")}
          />
        );
      case "face-failed":
        return (
          <FaceFailedScreen
            allowPin={!firstAccess}
            onRetry={() => {
              setFaceImage(null);
              setScreen("face-camera");
            }}
            onUsePin={() => setScreen("verify-pin")}
            onBack={() => setScreen("login")}
            onHelp={() =>
              setNotice("Hubungi Admin Unit melalui kanal resmi MITRA untuk bantuan verifikasi.")
            }
          />
        );
      case "pin-create":
        return (
          <PinCreateScreen
            onComplete={() => {
              setScreen("unit");
            }}
            onBack={() => setScreen("face-intro")}
          />
        );
      case "success":
        return (
          <SuccessScreen
            returning={!firstAccess}
            unit={getUnit(unit)}
            method={firstAccess ? "face-pin" : lastMethod}
            onContinue={() => setScreen("home")}
          />
        );
      case "unit":
        return (
          <UnitScreen
            unit={unit}
            onContinue={() => setScreen("success")}
            onHelp={() =>
              setNotice("Perubahan unit diproses Admin Unit. Prototype ini tidak mengirim permintaan.")
            }
          />
        );
      case "home":
        return (
          <UnitHomeScreen
            unit={unit}
            activity={activityDraft}
            activityCompleted={activityCompleted}
            activityLeadCount={activityLeads.length}
            onLogout={logout}
            onActivity={() => setScreen("activity")}
          />
        );
      case "activity":
        return (
          <ActivityListScreen
            unit={unit}
            activity={activityDraft}
            completed={activityCompleted}
            leadCount={activityLeads.length}
            onBack={() => setScreen("home")}
            onCreate={() => setScreen("activity-type")}
            onOpen={() =>
              setScreen(activityCompleted ? "activity-done" : "activity-checkin")
            }
          />
        );
      case "activity-type":
        return (
          <ActivityTypeScreen
            initialKind={activityDraft.kind}
            initialArea={activityDraft.area}
            onBack={() => setScreen("activity")}
            onContinue={(kind, area) => {
              setActivityDraft((current) => ({
                ...current,
                kind,
                area,
                name:
                  current.name === defaultActivityName(current.kind)
                    ? defaultActivityName(kind)
                    : current.name,
              }));
              setActivityLeads([]);
              setActivityCheckin("09.42");
              setActivityCompleted(false);
              setScreen("activity-schedule");
            }}
          />
        );
      case "activity-schedule":
        return (
          <ActivityScheduleScreen
            kind={activityDraft.kind}
            area={activityDraft.area}
            initialName={activityDraft.name}
            initialLocationName={activityDraft.locationName}
            initialAddress={activityDraft.address}
            initialVillage={activityDraft.village}
            initialRegion={activityDraft.region}
            initialTime={activityDraft.time}
            onBack={() => setScreen("activity-type")}
            onCreated={(draft) => {
              setActivityDraft(draft);
              setScreen("activity-created");
            }}
          />
        );
      case "activity-created":
        return (
          <ActivityCreatedScreen
            draft={activityDraft}
            onBack={() => setScreen("activity")}
            onCheckin={() => setScreen("activity-checkin")}
          />
        );
      case "activity-checkin":
        return (
          <ActivityCheckinScreen
            draft={activityDraft}
            onBack={() => setScreen("activity-schedule")}
            onCheckedIn={(time) => {
              setActivityCheckin(time);
              setScreen("activity-leads");
            }}
          />
        );
      case "activity-leads":
        return (
          <ActivityLeadsScreen
            draft={activityDraft}
            checkinTime={activityCheckin}
            leads={activityLeads}
            onAddLead={(lead) => setActivityLeads((current) => [...current, lead])}
            onBack={() => setScreen("activity")}
            onFinish={() => setScreen("activity-checkout")}
          />
        );
      case "activity-checkout":
        return (
          <ActivityCheckoutScreen
            draft={activityDraft}
            checkinTime={activityCheckin}
            leadCount={activityLeads.length}
            onBack={() => setScreen("activity-leads")}
            onDone={() => {
              setActivityCompleted(true);
              setScreen("activity-done");
            }}
          />
        );
      case "activity-done":
        return (
          <ActivityDoneScreen
            leadCount={activityLeads.length}
            checkinTime={activityCheckin}
            onHome={() => setScreen("home")}
            onActivity={() => setScreen("activity")}
          />
        );
      case "forgot":
        return (
          <ForgotScreen
            onBack={() => setScreen("login")}
            onSent={() => setScreen("forgot-otp")}
          />
        );
      case "forgot-otp":
        return (
          <OtpScreen
            onBack={() => setScreen("forgot")}
            onVerified={() => setScreen("forgot-reset")}
          />
        );
      case "forgot-reset":
        return (
          <ResetPasswordScreen
            onBack={() => setScreen("forgot-otp")}
            onSaved={() => setScreen("forgot-done")}
          />
        );
      case "forgot-done":
        return (
          <ForgotDoneScreen
            onLogin={() => {
              setSessionActive(false);
              startFlow(mode, false);
            }}
          />
        );
      case "force-change":
        return (
          <ResetPasswordScreen
            forceChange
            defaultPassword
            onBack={logout}
            onSaved={() => setScreen("face-intro")}
          />
        );
      default:
        return null;
    }
  }

  const darkStatus = ["face-camera", "face-processing", "face-review"].includes(screen);

  const phone = (
    <div className="phone-frame">
      <div className="phone-screen">
        <StatusBar tone={darkStatus ? "light" : "dark"} />
        <div className="phone-scroll" ref={scrollRef}>
          <div key={screen} className="screen-enter min-h-full">
            {renderScreen()}
          </div>
        </div>
        <div className="sr-only" aria-live="polite">
          {screenLabel(screen)}
        </div>
        {notice ? (
          <div className="toast" role="status">
            <Info className="mt-0.5 h-4 w-4 flex-none text-[#f9a11f]" aria-hidden="true" />
            <span>{notice}</span>
          </div>
        ) : null}
      </div>
    </div>
  );

  return (
    <div className="page-canvas flex min-h-dvh items-center justify-center lg:py-8">
      {phone}
    </div>
  );
}

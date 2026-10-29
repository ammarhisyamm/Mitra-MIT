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
  ActivityCameraScreen,
  ActivityCreateScreen,
  ActivityDetailScreen,
  ActivityListScreen,
  ActivityMapScreen,
  LeadAddScreen,
  LeadVerifyScreen,
  SimulationScreen,
} from "@/screens/ActivityScreens";
import { StatusBar } from "@/components/primitives";
import { OverlayRoot } from "@/components/mobile";
import {
  getUnit,
  screenLabel,
  type BusinessUnit,
  type Mode,
  type Scenario,
  type Screen,
} from "@/lib/demo";
import {
  activityStatus,
  emptyForm,
  initialActivities,
  uid,
  type Activity,
  type ActivityForm,
  type Collateral,
  type Lead,
} from "@/lib/activity";

export default function App() {
  const [mode, setMode] = useState<Mode>("returning");
  const [sessionActive, setSessionActive] = useState(true);
  const [scenario] = useState<Scenario>("normal");
  const [forceFaceFail] = useState(false);
  const [forceLoginFail] = useState(false);
  const [unit] = useState<BusinessUnit>("gmn");
  const [screen, setScreen] = useState<Screen>("checking");
  const [firstAccess, setFirstAccess] = useState(false);
  const [faceImage, setFaceImage] = useState<string | null>(null);
  const [lastMethod, setLastMethod] = useState<"face" | "pin">("face");
  const [runId, setRunId] = useState(0);
  const [notice, setNotice] = useState("");
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [activityId, setActivityId] = useState("act-1");
  const [leadId, setLeadId] = useState<string | null>(null);
  const [leadName, setLeadName] = useState("");
  const [createForm, setCreateForm] = useState<ActivityForm>(emptyForm);
  const startConfig = useRef({ mode: "returning" as Mode, sessionActive: true });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const config = startConfig.current;
    const timer = window.setTimeout(() => {
      setFirstAccess(config.mode === "first");
      if (config.mode === "returning" && config.sessionActive) {
        setScreen("activity");
      } else {
        setScreen("login");
      }
    }, 2400);
    return () => window.clearTimeout(timer);
  }, [runId]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 3200);
    return () => window.clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    document.title = `MITRA · ${screenLabel(screen)}`;
    scrollRef.current?.scrollTo({ top: 0 });
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
    setActivities(initialActivities());
    setCreateForm(emptyForm());
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
    setMode("first");
    startFlow("first", false);
    setSessionActive(false);
  }

  const activity = activities.find((item) => item.id === activityId) ?? activities[0];
  const lead = activity?.leads.find((item) => item.id === leadId) ?? null;

  function updateActivity(id: string, update: (activity: Activity) => Activity) {
    setActivities((current) => current.map((item) => (item.id === id ? update(item) : item)));
  }

  function updateLead(id: string, patch: Partial<Lead>) {
    updateActivity(activityId, (current) => ({
      ...current,
      leads: current.leads.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));
  }

  function createActivity() {
    const form = createForm;
    const next: Activity = {
      id: uid("act"),
      kind: form.kind,
      area: form.area ?? "inside",
      name: form.name.trim(),
      locationName: form.locationName,
      locationAddress: form.locationAddress,
      date: form.date,
      start: form.start,
      end: form.end,
      checkinTime: null,
      checkoutTime: null,
      leads: [],
    };
    setActivities((current) => [next, ...current]);
    setCreateForm(emptyForm());
    setScreen("activity");
  }

  function saveLead(prospect: boolean) {
    const existing = activity.leads.find((item) => item.id === leadId);
    if (existing) {
      if (prospect) updateLead(existing.id, { prospect: true, heat: "warm" });
      return existing.id;
    }
    const next: Lead = {
      id: uid("lead"),
      name: leadName,
      phone: `0812${Math.floor(10_000_000 + Math.random() * 89_999_999)}`,
      prospect,
      heat: prospect ? "warm" : "cold",
      simulation: null,
    };
    updateActivity(activityId, (current) => ({ ...current, leads: [next, ...current.leads] }));
    setLeadId(next.id);
    return next.id;
  }

  const leadRegistered = activities.some((item) =>
    item.leads.some(
      (entry) => entry.id !== leadId && entry.name.toLowerCase() === leadName.toLowerCase(),
    ),
  );
  const soon = (label: string) => setNotice(`Menu ${label} belum tersedia di prototype ini.`);

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
      case "home": {
        const next =
          activities.find((item) => activityStatus(item) !== "ended") ?? activities[0];
        return (
          <UnitHomeScreen
            unit={unit}
            activity={{ name: next?.name ?? "Belum ada aktivitas", time: next?.start ?? "--:--" }}
            activityCompleted={next ? activityStatus(next) === "ended" : false}
            activityLeadCount={next?.leads.length ?? 0}
            onLogout={logout}
            onActivity={() => setScreen("activity")}
          />
        );
      }
      case "activity":
        return (
          <ActivityListScreen
            activities={activities}
            onOpen={(id) => {
              setActivityId(id);
              setScreen("activity-detail");
            }}
            onCheckIn={(id) => {
              setActivityId(id);
              setScreen("activity-camera");
            }}
            onCreate={() => setScreen("activity-create")}
            onHome={() => setScreen("home")}
            onSoon={soon}
          />
        );
      case "activity-create":
        return (
          <ActivityCreateScreen
            form={createForm}
            onChange={setCreateForm}
            onBack={() => setScreen("activity")}
            onPickMap={() => setScreen("activity-map")}
            onCreated={createActivity}
          />
        );
      case "activity-map":
        return (
          <ActivityMapScreen
            onBack={() => setScreen("activity-create")}
            onConfirm={(place) => {
              setCreateForm((current) => ({
                ...current,
                locationName: place.name,
                locationAddress: place.address,
              }));
              setScreen("activity-create");
            }}
          />
        );
      case "activity-camera":
        return (
          <ActivityCameraScreen
            activity={activity}
            onClose={() => setScreen("activity")}
            onCheckedIn={(time) => {
              updateActivity(activity.id, (current) => ({ ...current, checkinTime: time }));
              setScreen("activity-detail");
            }}
          />
        );
      case "activity-detail":
        return (
          <ActivityDetailScreen
            activity={activity}
            onBack={() => setScreen("activity")}
            onCheckIn={() => setScreen("activity-camera")}
            onCheckOut={() => {
              const now = new Date();
              const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
              updateActivity(activity.id, (current) => ({ ...current, checkoutTime: time }));
            }}
            onAddLead={() => {
              setLeadId(null);
              setLeadName("");
              setScreen("lead-add");
            }}
            onSimulate={(id) => {
              setLeadId(id);
              setScreen("lead-simulation");
            }}
            onVerify={(id) => {
              const target = activity.leads.find((item) => item.id === id);
              setLeadId(id);
              setLeadName(target?.name ?? "");
              setScreen("lead-verify");
            }}
          />
        );
      case "lead-add":
        return (
          <LeadAddScreen
            onBack={() => setScreen("activity-detail")}
            onSubmit={(name) => {
              setLeadName(name);
              setScreen("lead-verify");
            }}
          />
        );
      case "lead-verify":
        return (
          <LeadVerifyScreen
            name={leadName}
            registered={leadRegistered}
            onNotice={setNotice}
            onCancel={() => {
              saveLead(false);
              setScreen("activity-detail");
            }}
            onRegistered={() => setScreen("activity-detail")}
            onVerified={(next) => {
              saveLead(true);
              setScreen(next === "simulate" ? "lead-simulation" : "activity-detail");
            }}
          />
        );
      case "lead-simulation":
        return lead ? (
          <SimulationScreen
            lead={lead}
            onNotice={setNotice}
            onBack={() => setScreen("activity-detail")}
            onSent={(items: Collateral[]) => {
              updateLead(lead.id, { simulation: items });
              setScreen("activity-detail");
            }}
          />
        ) : null;
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

  const darkStatus = ["face-camera", "face-processing", "face-review", "activity-camera"].includes(screen);

  const phone = (
    <div className="phone-frame">
      <div className="phone-screen">
        <StatusBar tone={darkStatus ? "light" : "dark"} />
        <div className="phone-scroll" ref={scrollRef}>
          <div key={screen} className="screen-enter min-h-full">
            {renderScreen()}
          </div>
        </div>
        <OverlayRoot />
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

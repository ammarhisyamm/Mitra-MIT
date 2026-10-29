import { useCallback, useEffect, useRef, useState } from "react";
import { Info } from "lucide-react";
import {
  ForgotScreen,
  LoginScreen,
  NewPasswordScreen,
  OtpScreen,
} from "@/screens/AuthScreens";
import {
  BusinessUnitSheet,
  FaceCameraScreen,
  FaceErrorScreen,
  FaceGuideScreen,
  FaceScanScreen,
  FaceVerifyingScreen,
  PinCreateScreen,
  PinVerifyScreen,
  VerifyChoiceScreen,
  WelcomeScreen,
  type FaceCapture,
} from "@/screens/VerifyScreens";
import { SplashScreen } from "@/screens/SplashScreen";
import { HomeScreen } from "@/screens/HomeScreen";
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
import { OverlayRoot } from "@/components/mobile";
import { ProfileSheet } from "@/screens/ProfileSheet";
import {
  DEMO_ACCOUNTS,
  screenLabel,
  type Account,
  type AccountId,
  type BusinessUnit,
  type Screen,
} from "@/lib/demo";
import {
  emptyForm,
  initialActivities,
  uid,
  type Activity,
  type ActivityForm,
  type Collateral,
  type Lead,
} from "@/lib/activity";


export default function App() {
  const [screen, setScreen] = useState<Screen>("checking");
  // Prototype: nothing is persisted, so a refresh always starts again from login.
  const [accounts, setAccounts] = useState<Account[]>(DEMO_ACCOUNTS);
  const [accountId, setAccountId] = useState<AccountId>("returning");
  const [profileOpen, setProfileOpen] = useState(false);
  const [unitOpen, setUnitOpen] = useState(false);
  const [unit, setUnit] = useState<BusinessUnit>("mit");
  const [face, setFace] = useState<FaceCapture | null>(null);
  const [resetPhone, setResetPhone] = useState(DEMO_ACCOUNTS[1].phone);
  const [notice, setNotice] = useState("");
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [activityId, setActivityId] = useState("act-1");
  const [leadId, setLeadId] = useState<string | null>(null);
  const [leadName, setLeadName] = useState("");
  const [createForm, setCreateForm] = useState<ActivityForm>(emptyForm);
  const scrollRef = useRef<HTMLDivElement>(null);

  const account = accounts.find((item) => item.id === accountId) ?? accounts[0];
  const enrolling = !account.enrolled;

  useEffect(() => {
    const timer = window.setTimeout(() => setScreen("login"), 2200);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.brand = unit;
  }, [unit]);

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

  function updateAccount(id: AccountId, patch: Partial<Account>) {
    setAccounts((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function logout() {
    setUnit("mit");
    setFace(null);
    setActivities(initialActivities());
    setCreateForm(emptyForm());
    setScreen("login");
  }

  const faceScanned = useCallback(() => setScreen("face-verifying"), []);
  const faceVerified = useCallback(() => {
    if (face?.dark) setScreen("face-error");
    else setScreen(enrolling ? "pin-create" : "welcome");
  }, [enrolling, face]);

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
        return <SplashScreen />;
      case "login":
        return (
          <LoginScreen
            accounts={accounts}
            onForgot={() => setScreen("forgot")}
            onLoggedIn={(next, changePassword) => {
              setAccountId(next.id);
              if (!next.enrolled) setScreen(changePassword ? "change-password" : "face-intro");
              else setScreen("verify-choice");
            }}
          />
        );
      case "forgot":
        return (
          <ForgotScreen
            accounts={accounts}
            onBack={() => setScreen("login")}
            onSent={(phone) => {
              setResetPhone(phone);
              setScreen("forgot-otp");
            }}
          />
        );
      case "forgot-otp":
        return (
          <OtpScreen
            phone={resetPhone}
            onNotice={setNotice}
            onBack={() => setScreen("forgot")}
            onVerified={() => setScreen("forgot-reset")}
          />
        );
      case "forgot-reset":
        return (
          <NewPasswordScreen
            mode="reset"
            onBack={() => setScreen("forgot-otp")}
            onDone={(password) => {
              const target = accounts.find((item) => item.phone === resetPhone);
              if (target) updateAccount(target.id, { password });
              setScreen("login");
            }}
          />
        );
      case "change-password":
        return (
          <NewPasswordScreen
            mode="change"
            onBack={() => setScreen("login")}
            onDone={(password) => {
              updateAccount(account.id, { password });
              setScreen("face-intro");
            }}
          />
        );
      case "verify-choice":
        return (
          <VerifyChoiceScreen
            onBack={logout}
            onFace={() => setScreen("face-intro")}
            onPin={() => setScreen("verify-pin")}
          />
        );
      case "face-intro":
        return (
          <FaceGuideScreen
            enroll={enrolling}
            onStart={() => setScreen("face-camera")}
            onBack={() => (enrolling ? logout() : setScreen("verify-choice"))}
          />
        );
      case "face-camera":
        return (
          <FaceCameraScreen
            onClose={() => setScreen("face-intro")}
            onSubmit={(capture) => {
              setFace(capture);
              setScreen("face-scan");
            }}
          />
        );
      case "face-scan":
        return <FaceScanScreen photo={face?.photo ?? "/face/sample-face.jpg"} onDone={faceScanned} />;
      case "face-verifying":
        return <FaceVerifyingScreen onDone={faceVerified} />;
      case "face-error":
        return (
          <FaceErrorScreen onBack={() => setScreen("face-intro")} onRetry={() => setScreen("face-camera")} />
        );
      case "pin-create":
        return (
          <PinCreateScreen
            onBack={() => setScreen("face-intro")}
            onDone={(pin) => {
              updateAccount(account.id, { pin, enrolled: true });
              setScreen("welcome");
            }}
          />
        );
      case "verify-pin":
        return (
          <PinVerifyScreen
            expectedPin={account.pin ?? ""}
            onBack={() => setScreen("verify-choice")}
            onForgot={() => setNotice("Reset PIN belum tersedia di prototype ini. Gunakan verifikasi wajah.")}
            onSuccess={() => setScreen("welcome")}
          />
        );
      case "welcome":
        return (
          <WelcomeScreen
            account={account}
            unit={unit}
            onPickUnit={() => setUnitOpen(true)}
            onBack={logout}
            onContinue={() => setScreen("home")}
          />
        );
      case "home":
        return (
          <HomeScreen
            name={account.name}
            activities={activities}
            onOpenActivity={(id) => {
              setActivityId(id);
              setScreen("activity-detail");
            }}
            onCheckIn={(id) => {
              setActivityId(id);
              setScreen("activity-camera");
            }}
            onActivities={() => setScreen("activity")}
            onSimulate={() => {
              setLeadId(null);
              setScreen("quick-simulation");
            }}
            onProfile={() => setProfileOpen(true)}
            onSoon={soon}
          />
        );
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
            onProfile={() => setProfileOpen(true)}
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
      case "quick-simulation":
        return (
          <SimulationScreen
            lead={null}
            onNotice={setNotice}
            onBack={() => setScreen("home")}
            onSent={() => setScreen("home")}
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
      default:
        return null;
    }
  }

  return (
    <div className="page-canvas">
      <div className="phone-frame">
        <div className="phone-screen">
          <div className="phone-scroll" ref={scrollRef}>
            <div key={screen} className="screen-enter min-h-full">
              {renderScreen()}
            </div>
          </div>
          <OverlayRoot />
          <ProfileSheet
            open={profileOpen}
            name={account.name}
            unit={unit}
            onClose={() => setProfileOpen(false)}
            onSwitchUnit={() => {
              setProfileOpen(false);
              setUnitOpen(true);
            }}
            onLogout={() => {
              setProfileOpen(false);
              logout();
            }}
          />
          <BusinessUnitSheet
            open={unitOpen}
            value={unit}
            onChange={setUnit}
            onClose={() => setUnitOpen(false)}
          />
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
    </div>
  );
}

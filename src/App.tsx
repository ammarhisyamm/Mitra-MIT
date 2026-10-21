import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Clock3,
  Info,
  KeyRound,
  PanelRightOpen,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
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
import { PrototypePanel } from "@/components/PrototypePanel";
import { MitraLogo, StatusBar } from "@/components/primitives";
import {
  getUnit,
  screenLabel,
  type BusinessUnit,
  type Mode,
  type Scenario,
  type Screen,
} from "@/lib/demo";

export default function App() {
  const [mode, setMode] = useState<Mode>("first");
  const [sessionActive, setSessionActive] = useState(true);
  const [scenario, setScenario] = useState<Scenario>("normal");
  const [forceFaceFail, setForceFaceFail] = useState(false);
  const [forceLoginFail, setForceLoginFail] = useState(false);
  const [unit, setUnit] = useState<BusinessUnit>("gmn");
  const [screen, setScreen] = useState<Screen>("checking");
  const [firstAccess, setFirstAccess] = useState(true);
  const [faceImage, setFaceImage] = useState<string | null>(null);
  const [runId, setRunId] = useState(0);
  const [notice, setNotice] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const startConfig = useRef({ mode: "first" as Mode, sessionActive: true });

  useEffect(() => {
    const config = startConfig.current;
    const timer = window.setTimeout(() => {
      setFirstAccess(config.mode === "first");
      if (config.mode === "returning" && config.sessionActive) {
        setScreen("verify-choice");
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
  }, [screen]);

  useEffect(() => {
    if (!panelOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPanelOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [panelOpen]);

  function startFlow(nextMode: Mode, nextSession: boolean) {
    startConfig.current = { mode: nextMode, sessionActive: nextSession };
    setScreen("checking");
    setFaceImage(null);
    setFirstAccess(nextMode === "first");
    setRunId((current) => current + 1);
  }

  function restart() {
    startFlow(mode, sessionActive);
  }

  function changeMode(nextMode: Mode) {
    setMode(nextMode);
    startFlow(nextMode, nextMode === "returning" ? sessionActive : false);
  }

  function changeSession(nextSession: boolean) {
    setSessionActive(nextSession);
    startFlow(mode, nextSession);
  }

  function jump(next: Screen, nextMode?: Mode) {
    if (nextMode && nextMode !== mode) {
      setMode(nextMode);
      setFirstAccess(nextMode === "first");
      if (nextMode === "returning") setSessionActive(true);
    }
    setFaceImage(null);
    setScreen(next);
  }

  function loginSuccess() {
    if (scenario === "default-password") {
      setScreen("force-change");
      return;
    }
    setScreen(firstAccess ? "face-intro" : "verify-choice");
  }

  function faceDone() {
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
            mode={mode}
            sessionActive={sessionActive}
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
            onSuccess={() => setScreen("success")}
            onBack={() => setScreen("verify-choice")}
            onUseFace={() => {
              setFaceImage(null);
              setScreen("face-intro");
            }}
            onForgotPin={logout}
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
              setScreen("face-review");
            }}
            onBack={() => setScreen("face-intro")}
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
            onBack={() => setScreen("face-camera")}
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
          />
        );
      case "pin-create":
        return (
          <PinCreateScreen
            onComplete={() => {
              setScreen("success");
            }}
            onBack={() => setScreen("face-intro")}
          />
        );
      case "success":
        return (
          <SuccessScreen
            returning={!firstAccess}
            unit={getUnit(unit)}
            onContinue={() => setScreen(firstAccess ? "unit" : "home")}
          />
        );
      case "unit":
        return (
          <UnitScreen
            unit={unit}
            returning={!firstAccess}
            onSelect={setUnit}
            onContinue={() => setScreen("home")}
            onHelp={() =>
              setNotice("Hubungi admin unit untuk mengubah unit kerja Anda.")
            }
          />
        );
      case "home":
        return <UnitHomeScreen unit={unit} onLogout={logout} />;
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

  const phone = (
    <div className="phone-frame">
      <div className="phone-screen">
        <StatusBar />
        <div className="phone-scroll">
          <div key={screen} className="screen-enter min-h-full">
            {renderScreen()}
          </div>
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

  const panel = (
    <PrototypePanel
      mode={mode}
      sessionActive={sessionActive}
      scenario={scenario}
      forceFaceFail={forceFaceFail}
      forceLoginFail={forceLoginFail}
      unit={unit}
      screen={screen}
      onMode={changeMode}
      onSession={changeSession}
      onScenario={setScenario}
      onForceFaceFail={setForceFaceFail}
      onForceLoginFail={setForceLoginFail}
      onUnit={setUnit}
      onRestart={restart}
      onJump={jump}
    />
  );

  return (
    <div className="page-canvas relative min-h-dvh overflow-x-hidden">
      <header className="relative z-10 mx-auto hidden w-full max-w-[1260px] items-center justify-between gap-4 px-5 pb-3 pt-6 lg:flex lg:px-10">
        <div>
          <MitraLogo />
          <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#9ca3af]">
            Prototype · First login
          </p>
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <span className="rounded-full border border-white/70 bg-white/70 px-3 py-1.5 text-[10.5px] font-semibold text-[#5b6b85] backdrop-blur">
            Brand MIT
          </span>
          <span className="rounded-full border border-white/70 bg-white/70 px-3 py-1.5 text-[10.5px] font-semibold text-[#5b6b85] backdrop-blur">
            UX Writing · Draft
          </span>
          <a
            href="https://mit-ds-git-design-syst-bc82ea-ammarhisyam151-gmailcoms-projects.vercel.app/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#122b5c] px-3.5 py-1.5 text-[10.5px] font-semibold text-white transition hover:bg-[#0f234d]"
          >
            MIT DS guideline
            <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
          </a>
        </div>
      </header>

      <main className="relative z-10 mx-auto grid w-full max-w-[1260px] items-start gap-8 px-0 pb-0 pt-0 lg:grid-cols-[minmax(0,1fr)_418px] lg:gap-12 lg:px-10 lg:pb-14 lg:pt-3">
        <section className="hidden lg:block">
          <div className="mx-auto max-w-[700px]">
            <div className="float-in">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#2852a3]">
                Satu alur, tiga momen kepercayaan
              </p>
              <h1 className="mt-3 text-[42px] font-extrabold leading-[1.02] tracking-[-0.035em] text-[#101a2e]">
                Masuk pertama,
                <br />
                <span className="text-[#2852a3]">tanpa friksi.</span>
              </h1>
              <p className="mt-3 max-w-[520px] text-[13px] leading-relaxed text-[#5b6b85]">
                Prototype alur first login MITRA: verifikasi wajah, pembuatan PIN, dan routing
                unit. Semua state penting bisa dicoba dari panel di samping.
              </p>
            </div>

            <div className="float-in float-in-delay-1 mt-6 flex justify-center">
              {phone}
            </div>

            <div className="float-in float-in-delay-2 mt-5 grid grid-cols-3 gap-2.5">
              {[
                {
                  icon: ShieldCheck,
                  title: "Verifikasi wajah",
                  detail: "Foto + pencocokan identitas",
                },
                {
                  icon: KeyRound,
                  title: "PIN 6 angka",
                  detail: "Masuk cepat di perangkat",
                },
                {
                  icon: Clock3,
                  title: "Sesi 30 hari",
                  detail: "Verifikasi ulang terkendali",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-[14px] border border-white/80 bg-white/65 p-3 backdrop-blur"
                >
                  <item.icon className="h-4 w-4 text-[#2852a3]" aria-hidden="true" />
                  <p className="mt-2 text-[11px] font-bold text-[#344054]">{item.title}</p>
                  <p className="mt-0.5 text-[10px] leading-snug text-[#7c8ba3]">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="lg:hidden">{phone}</section>

        <aside className="sticky top-6 hidden lg:block">
          <div className="side-panel max-h-[calc(100dvh-48px)] overflow-y-auto p-5">{panel}</div>
        </aside>
      </main>

      <footer className="relative z-10 mx-auto hidden w-full max-w-[1260px] items-center justify-between px-10 pb-7 text-[10px] text-[#8a98ad] lg:flex">
        <p>MITRA × MIT DS · Prototype internal, bukan produk final.</p>
        <p className="flex items-center gap-1.5">
          <Smartphone className="h-3 w-3" aria-hidden="true" />
          Dioptimalkan untuk 390 × 844 · tautan guideline mengarah ke MIT DS
        </p>
      </footer>

      <button
        type="button"
        onClick={() => setPanelOpen(true)}
        className="mobile-prototype-button lg:hidden"
        aria-haspopup="dialog"
      >
        <PanelRightOpen className="h-3.5 w-3.5" aria-hidden="true" />
        Prototype
      </button>

      {panelOpen ? (
        <div className="lg:hidden">
          <button
            type="button"
            className="sheet-backdrop"
            aria-label="Tutup panel"
            onClick={() => setPanelOpen(false)}
          />
          <div
            className="sheet-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Kontrol prototype"
          >
            <PrototypePanel
              mode={mode}
              sessionActive={sessionActive}
              scenario={scenario}
              forceFaceFail={forceFaceFail}
              forceLoginFail={forceLoginFail}
              unit={unit}
              screen={screen}
              onMode={changeMode}
              onSession={changeSession}
              onScenario={setScenario}
              onForceFaceFail={setForceFaceFail}
              onForceLoginFail={setForceLoginFail}
              onUnit={setUnit}
              onRestart={() => {
                restart();
                setPanelOpen(false);
              }}
              onJump={(next, nextMode) => {
                jump(next, nextMode);
                setPanelOpen(false);
              }}
              onClose={() => setPanelOpen(false)}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

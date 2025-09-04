import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  CreditCard,
  Car,
  GraduationCap,
  Users,
  Zap,
  ShoppingCart,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Target,
  Sparkles,
} from "lucide-react";

interface OnboardingData {
  housing: "own" | "rent" | "other" | null;
  mortgage: boolean | null;
  debt: string[];
  transportation: string[];
  spendingCategories: string[];
  household: string[];
  goals: string[];
}

export default function OnboardingFlow() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    housing: null,
    mortgage: null,
    debt: [],
    transportation: [],
    spendingCategories: [],
    household: [],
    goals: [],
  });

  const questions = [
    {
      id: "welcome",
      title: "Let's build your plan",
      subtitle:
        "We've got a few questions to help build your plan and set you up to give every dollar a job with confidence.",
      icon: Target,
      bgColor: "from-green-400 to-green-500",
    },
    {
      id: "household",
      title: "Who's in your household?",
      subtitle: "This helps us understand your family situation",
      icon: Users,
      bgColor: "from-blue-400 to-blue-500",
      options: [
        { id: "myself", label: "Myself", value: "myself" },
        { id: "partner", label: "My partner", value: "partner" },
        { id: "kids", label: "Kids", value: "kids" },
        { id: "other-adults", label: "Other adults", value: "other-adults" },
        { id: "teens", label: "Teens", value: "teens" },
        { id: "pets", label: "Pets", value: "pets" },
      ],
    },
    {
      id: "housing",
      title: "Tell us about your home",
      subtitle: "Understanding your housing situation helps with budgeting",
      icon: Home,
      bgColor: "from-purple-400 to-purple-500",
      options: [
        { id: "own", label: "I own", value: "own" },
        { id: "rent", label: "I rent", value: "rent" },
        { id: "other", label: "Other", value: "other" },
      ],
    },
    {
      id: "mortgage",
      title: "Do you have a mortgage?",
      subtitle: "This affects your monthly payment structure",
      icon: Home,
      bgColor: "from-blue-400 to-blue-500",
      options: [
        { id: "yes", label: "Yes", value: true },
        { id: "no", label: "No, my house is paid off", value: false },
      ],
    },
    {
      id: "debt",
      title: "Do you currently have any debt?",
      subtitle: "We'll help you optimize and potentially switch to better rates",
      icon: CreditCard,
      bgColor: "from-red-400 to-red-500",
      options: [
        { id: "credit-card", label: "Credit card", value: "credit-card" },
        { id: "auto-loans", label: "Auto loans", value: "auto-loans" },
        { id: "student-loans", label: "Student loans", value: "student-loans" },
        { id: "personal-loans", label: "Personal loans", value: "personal-loans" },
        { id: "medical-debt", label: "Medical debt", value: "medical-debt" },
        { id: "buy-now-pay-later", label: "Buy now, pay later", value: "bnpl" },
        { id: "no-debt", label: "I don't currently have debt", value: "none" },
      ],
    },
    {
      id: "transportation",
      title: "How do you get around?",
      subtitle: "Transportation costs can be optimized through insurance switching",
      icon: Car,
      bgColor: "from-yellow-400 to-orange-500",
      options: [
        { id: "car", label: "Car", value: "car" },
        { id: "rideshare", label: "Rideshare", value: "rideshare" },
        { id: "bike", label: "Bike", value: "bike" },
        { id: "walk", label: "Walk", value: "walk" },
        { id: "public-transit", label: "Public transit", value: "public-transit" },
        { id: "motorcycle", label: "Motorcycle", value: "motorcycle" },
        { id: "wheelchair", label: "Wheelchair", value: "wheelchair" },
        { id: "none", label: "None of these apply to me", value: "none" },
      ],
    },
    {
      id: "spending",
      title: "Which of these do you regularly spend money on?",
      subtitle: "We'll analyze these categories for switching opportunities",
      icon: ShoppingCart,
      bgColor: "from-green-400 to-green-500",
      options: [
        { id: "groceries", label: "Groceries", value: "groceries" },
        { id: "utilities", label: "Utilities/Energy", value: "utilities" },
        { id: "insurance", label: "Insurance", value: "insurance" },
        { id: "subscriptions", label: "Subscriptions", value: "subscriptions" },
        { id: "dining", label: "Dining out", value: "dining" },
        { id: "shopping", label: "Shopping", value: "shopping" },
        { id: "healthcare", label: "Healthcare", value: "healthcare" },
        { id: "education", label: "Education", value: "education" },
      ],
    },
    {
      id: "goals",
      title: "What are your financial goals?",
      subtitle: "We'll help you achieve these through smart switching and optimization",
      icon: GraduationCap,
      bgColor: "from-purple-400 to-purple-500",
      options: [
        { id: "pay-off-debt", label: "Pay off debt faster", value: "debt-payoff" },
        { id: "save-money", label: "Save money on bills", value: "save-money" },
        { id: "college-fund", label: "Build college fund", value: "college-fund" },
        { id: "emergency-fund", label: "Emergency fund", value: "emergency-fund" },
        { id: "retirement", label: "Retirement planning", value: "retirement" },
        { id: "home-purchase", label: "Buy a home", value: "home-purchase" },
        { id: "vacation", label: "Save for vacation", value: "vacation" },
        { id: "investment", label: "Start investing", value: "investment" },
      ],
    },
  ];

  const currentQuestion = questions[currentStep];
  const isLastStep = currentStep === questions.length - 1;
  const isWelcomeStep = currentStep === 0;

  const handleOptionSelect = (questionId: string, optionValue: any) => {
    setData((prev) => {
      const newData = { ...prev };

      if (questionId === "housing") {
        newData.housing = optionValue;
      } else if (questionId === "mortgage") {
        newData.mortgage = optionValue;
      } else if (questionId === "household") {
        // Handle household composition as multi-select
        const currentHousehold = newData.household || [];
        if (currentHousehold.includes(optionValue)) {
          newData.household = currentHousehold.filter((h) => h !== optionValue);
        } else {
          newData.household = [...currentHousehold, optionValue];
        }
      } else if (questionId === "debt") {
        if (optionValue === "none") {
          newData.debt = [];
        } else {
          const currentDebt = newData.debt || [];
          if (currentDebt.includes(optionValue)) {
            newData.debt = currentDebt.filter((d) => d !== optionValue);
          } else {
            newData.debt = [...currentDebt, optionValue];
          }
        }
      } else if (questionId === "transportation") {
        if (optionValue === "none") {
          newData.transportation = [];
        } else {
          const currentTransport = newData.transportation || [];
          if (currentTransport.includes(optionValue)) {
            newData.transportation = currentTransport.filter((t) => t !== optionValue);
          } else {
            newData.transportation = [...currentTransport, optionValue];
          }
        }
      } else if (questionId === "spending") {
        const currentSpending = newData.spendingCategories || [];
        if (currentSpending.includes(optionValue)) {
          newData.spendingCategories = currentSpending.filter((s) => s !== optionValue);
        } else {
          newData.spendingCategories = [...currentSpending, optionValue];
        }
      } else if (questionId === "goals") {
        const currentGoals = newData.goals || [];
        if (currentGoals.includes(optionValue)) {
          newData.goals = currentGoals.filter((g) => g !== optionValue);
        } else {
          newData.goals = [...currentGoals, optionValue];
        }
      }

      return newData;
    });
  };

  const nextStep = () => {
    if (currentStep === 2 && data.housing !== "own") {
      // Skip mortgage question if not homeowner
      setCurrentStep(4);
    } else if (isLastStep) {
      // Save onboarding data and redirect to main app
      localStorage.setItem("myai-onboarding", JSON.stringify(data));
      navigate("/ingest");
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep === 4 && data.housing !== "own") {
      // Skip back over mortgage question if not homeowner
      setCurrentStep(2);
    } else {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const getSelectedOptions = (questionId: string) => {
    switch (questionId) {
      case "household":
        return data.household || [];
      case "debt":
        return data.debt || [];
      case "transportation":
        return data.transportation || [];
      case "spending":
        return data.spendingCategories || [];
      case "goals":
        return data.goals || [];
      default:
        return [];
    }
  };

  const isOptionSelected = (questionId: string, optionValue: any) => {
    switch (questionId) {
      case "housing":
        return data.housing === optionValue;
      case "mortgage":
        return data.mortgage === optionValue;
      case "household":
      case "debt":
      case "transportation":
      case "spending":
      case "goals":
        const selected = getSelectedOptions(questionId);
        return selected.includes(optionValue);
      default:
        return false;
    }
  };

  if (isWelcomeStep) {
    const IconComponent = currentQuestion.icon;
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div
              className={`w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r ${currentQuestion.bgColor} rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-6`}
            >
              <IconComponent className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {currentQuestion.title}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 px-4">{currentQuestion.subtitle}</p>
          </div>

          <button
            onClick={nextStep}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl text-base sm:text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Get Started
          </button>
        </div>
      </div>
    );
  }

  const IconComponent = currentQuestion.icon;
  const progress = (currentStep / (questions.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200">
        <div
          className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 pt-8 sm:pt-12">
        {/* Question Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div
            className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${currentQuestion.bgColor} rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-4 sm:mb-6`}
          >
            <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 px-4">
            {currentQuestion.title}
          </h1>
          <p className="text-base sm:text-lg text-gray-600 px-4">{currentQuestion.subtitle}</p>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-8 sm:mb-12">
          {currentQuestion.options?.map((option) => {
            const isSelected = isOptionSelected(currentQuestion.id, option.value);
            const isMultiSelect = [
              "household",
              "debt",
              "transportation",
              "spending",
              "goals",
            ].includes(currentQuestion.id);

            return (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(currentQuestion.id, option.value)}
                className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-200 text-left ${
                  isSelected
                    ? "border-blue-500 bg-blue-50 text-blue-900"
                    : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm sm:text-base font-medium">{option.label}</span>
                  {isSelected && <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center px-2">
          <button
            onClick={prevStep}
            disabled={currentStep <= 1}
            className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-all duration-200 text-sm sm:text-base ${
              currentStep <= 1
                ? "opacity-50 cursor-not-allowed text-gray-400"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            Back
          </button>

          <button
            onClick={nextStep}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            {isLastStep ? "Complete Setup" : "Continue"}
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

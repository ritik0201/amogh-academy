"use client";

import React, { useEffect, useState, use } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import { BookOpen, Users, Star, GraduationCap, Clock, CheckCircle, Navigation, LayoutDashboard, Share2 } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/courses/${resolvedParams.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setCourse(data);
        }
      })
      .catch((err) => console.error("Error fetching course:", err))
      .finally(() => setLoading(false));
  }, [resolvedParams.id]);

  const handleShare = async () => {
    const url = `${window.location.origin}/courses/${course._id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join ${course.title} at Amogh Academy`,
          text: `I highly recommend ${course.title}! Check it out here:`,
          url: url,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Course link copied to clipboard!");
    }
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleEnroll = async () => {
    if (status !== "authenticated") {
      toast.info("Please log in to enroll in this course.");
      router.push("/login");
      return;
    }

    setIsProcessing(true);
    const res = await loadRazorpay();

    if (!res) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      setIsProcessing(false);
      return;
    }

    try {
      // 1. Create order on server
      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: course.price || 5, 
          courseId: course._id 
        }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) throw new Error(orderData.error || "Failed to create order");

      // 2. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RP_KEY_ID,
        amount: orderData.amount,
        currency: "INR",
        name: "Amogh Academy",
        description: `Purchase ${course.title}`,
        image: "/logo.png",
        order_id: orderData.id,
        handler: async function (response: any) {
          // 3. Verify payment on server
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              courseId: course._id,
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyRes.ok) {
            toast.success("Payment Successful! Welcome to the course.");
            router.push("/student/course");
          } else {
            toast.error("Verification failed: " + verifyData.error);
          }
        },
        prefill: {
          name: session?.user?.name,
          email: session?.user?.email,
        },
        theme: {
          color: "#2563eb",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col pt-32">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col pt-32">
        <Navbar />
        <div className="flex-1 flex justify-center items-center mb-10">
          <div className="text-center">
             <h2 className="text-3xl font-black text-slate-800">Course Not Found</h2>
             <Link href="/courses" className="text-blue-600 hover:underline mt-4 inline-block font-bold">Return to Courses</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-500 selection:text-white relative">
      <Navbar />

      <main className="relative z-10 pt-32 pb-24">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
             <div className="space-y-6 animate-in fade-in slide-in-from-left-10 duration-700">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-bold shadow-sm">
                   <BookOpen className="w-4 h-4" />
                   <span className="text-xs uppercase tracking-widest">Premium Course</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight">
                  {course.title}
                </h1>
                <p className="text-xl text-slate-600 font-medium leading-relaxed">
                  {course.description || "Take your skills to the next level with our professionally guided, industry-recognized curriculum."}
                </p>

                <div className="flex flex-wrap gap-6 pt-4">
                  <div className="flex items-center gap-2 text-slate-700 font-bold">
                    <Users className="w-5 h-5 text-blue-500" />
                    <span>{(course.enrolledStudents?.length || 0) + 120} Students Enrolled</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 font-bold">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span>4.9 / 5.0 Rating</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 font-bold">
                    <Clock className="w-5 h-5 text-sky-500" />
                    <span>Self-Paced</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-6">
                   {course.isEnrolled ? (
                      <Link 
                        href="/dashboard"
                        className="flex-1 max-w-[240px] flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-slate-900 text-white font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-95"
                      >
                         <LayoutDashboard className="w-5 h-5" />
                         Go to Dashboard
                      </Link>
                   ) : (
                      <button 
                        onClick={handleEnroll}
                        disabled={isProcessing}
                        className="flex-1 max-w-[240px] flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-blue-600 text-white font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/30 active:scale-95 disabled:opacity-50"
                      >
                         {isProcessing ? (
                           <Loader2 className="w-6 h-6 animate-spin" />
                         ) : (
                           <>
                             <GraduationCap className="w-6 h-6" />
                             Enroll for ₹{course.price}
                           </>
                         )}
                      </button>
                   )}

                   <button 
                     onClick={handleShare}
                     className="px-6 py-4 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-all shadow-sm active:scale-95 flex items-center gap-2"
                   >
                     <Share2 className="w-5 h-5" />
                     Share
                   </button>
                </div>
             </div>

             <div className="relative group animate-in fade-in slide-in-from-right-10 duration-700">
               <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-sky-400 rounded-[3rem] blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
               <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border border-white/20 shadow-2xl bg-slate-800">
                  <img 
                    src={course.thumbnail || "/api/placeholder/800/600"} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  {!course.thumbnail && (
                     <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-slate-400 font-bold uppercase tracking-widest text-sm">Course Visual Overview</span>
                     </div>
                  )}
               </div>
               
               {/* Instructor Badge */}
               <div className="absolute -bottom-6 -left-6 bg-white p-4 pr-6 rounded-3xl shadow-xl border border-slate-100 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-black text-xl shadow-inner">
                     {course.teacher?.name?.[0]?.toUpperCase() || "E"}
                  </div>
                  <div>
                     <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lead Instructor</div>
                     <div className="font-black text-slate-800 text-lg">{course.teacher?.name || "Expert Faculty"}</div>
                  </div>
               </div>
             </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
               <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
                 <h3 className="text-3xl font-black text-slate-900 border-b border-slate-100 pb-6">About this Course</h3>
                 <div className="prose prose-lg prose-slate max-w-none">
                    <p className="text-slate-600 font-medium leading-loose whitespace-pre-line">
                      {course.description || "This course covers all the essential topics and practical skills required to excel. Designed by industry experts, the curriculum guides you step-by-step through core concepts, ensuring you build a solid foundation and acquire advanced capabilities.\n\nWhether you are a beginner looking to start fresh or a professional aiming to upgrade, this program offers carefully structured modules, real-world examples, and hands-on exercises."}
                    </p>
                 </div>
               </div>

               <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-8">
                 <h3 className="text-3xl font-black text-slate-900 border-b border-slate-100 pb-6">What You Will Learn</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      "Core foundational principles",
                      "Advanced techniques and problem solving",
                      "Industry best practices",
                      "Real-world application development",
                      "Effective tools and workflows",
                      "Professional growth methodologies"
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                         <CheckCircle className="w-6 h-6 text-green-500 shrink-0" />
                         <span className="font-bold text-slate-700">{feature}</span>
                      </div>
                    ))}
                 </div>
               </div>
            </div>

            <div className="space-y-6">
               <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 sticky top-32">
                  <h4 className="text-xl font-black text-slate-900 mb-6">Course Features</h4>
                  <div className="space-y-4">
                     <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                        <span className="text-slate-500 font-bold text-sm">Course Level</span>
                        <span className="text-slate-800 font-black text-sm">Intermediate</span>
                     </div>
                     <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                        <span className="text-slate-500 font-bold text-sm">Access Duration</span>
                        <span className="text-slate-800 font-black text-sm">Lifetime</span>
                     </div>
                     <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                        <span className="text-slate-500 font-bold text-sm">Certificate</span>
                        <span className="text-slate-800 font-black text-sm">Included</span>
                     </div>
                     <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                        <span className="text-slate-500 font-bold text-sm">Total Lectures</span>
                        <span className="text-slate-800 font-black text-sm">{course.lectures?.length || 0}</span>
                     </div>
                  </div>
                  
                  <div className="mt-8 pt-8 border-t border-slate-100">
                     <p className="text-xs font-black text-slate-400 uppercase tracking-widest text-center mb-4">Secure Checkout</p>
                     <p className="text-center text-sm font-bold text-slate-500">
                       We guarantee a safe and secure payment process. Once enrolled, you will receive instant access to all materials.
                     </p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

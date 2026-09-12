import { CalendarDays, Check, CircleDollarSign, Download, Droplets, Eye, FileText, ShieldCheck, Smartphone, Sparkles, Trash2, Wallet, X } from "lucide-react-native";
import { File, Paths } from "expo-file-system";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Fragment, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, {
  Defs,
  Line,
  LinearGradient as SvgLinearGradient,
  Pattern,
  Polygon,
  Rect,
  Stop,
  Text as SvgText,
} from "react-native-svg";

import { tenantHome, tenantPayments } from "@/constants/rental";
import { formatPrice } from "@/lib/format";
import { initiatePayHeroPayment } from "@/lib/payhero";
import { useGlobalContext } from "@/lib/global-provider";

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const currentCharges = [
  { id: "water", label: "Water bill", detail: "September usage", amount: 850, icon: Droplets, color: "#2F6BFF", background: "#EAF1FF" },
  { id: "garbage", label: "Garbage collection", detail: "Monthly collection", amount: 300, icon: Trash2, color: "#159B6C", background: "#EAFBF4" },
  { id: "service", label: "Service charge", detail: "Shared areas & security", amount: 1200, icon: Sparkles, color: "#8B5CF6", background: "#F2ECFF" },
  { id: "other", label: "Other charges", detail: "No extra charges", amount: 0, icon: CircleDollarSign, color: "#667085", background: "#F2F4F7" },
];

export default function Payments() {
  const { user } = useGlobalContext();
  const [showPay, setShowPay] = useState(false);
  const [showStatement, setShowStatement] = useState(false);
  const [downloadingStatement, setDownloadingStatement] = useState(false);
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState(String(tenantHome.balance));
  const [paymentLabel, setPaymentLabel] = useState("Rent");
  const [submitting, setSubmitting] = useState(false);
  const paidTotal = useMemo(() => tenantPayments.reduce((sum, item) => sum + item.amount, 0), []);
  const paymentChart = useMemo(
    () => [
      ...[...tenantPayments].reverse().map((item) => ({
        label: item.date.split(" ")[1],
        amount: item.amount,
        paid: true,
      })),
      { label: "Oct", amount: tenantHome.balance, paid: false },
    ],
    []
  );
  const maxChartAmount = Math.max(...paymentChart.map((item) => item.amount));
  const chargesTotal = currentCharges.reduce((sum, charge) => sum + charge.amount, 0);

  const openPayment = (label: string, paymentAmount: number) => {
    setPaymentLabel(label);
    setAmount(String(paymentAmount));
    setShowPay(true);
  };

  const downloadStatement = async () => {
    setDownloadingStatement(true);
    try {
      const tenantName = escapeHtml(user?.name || "Tenant");
      const generatedOn = new Intl.DateTimeFormat("en-KE", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(new Date());
      const transactionRows = tenantPayments
        .map(
          (item) => `
            <tr>
              <td>${escapeHtml(item.date)}</td>
              <td>${escapeHtml(item.description)}</td>
              <td>${escapeHtml(item.method)}</td>
              <td>${escapeHtml(item.receipt)}</td>
              <td class="amount">${escapeHtml(formatPrice(item.amount))}</td>
              <td><span class="paid">${escapeHtml(item.status)}</span></td>
            </tr>`
        )
        .join("");

      const html = `
        <!doctype html>
        <html>
          <head>
            <meta charset="utf-8" />
            <style>
              @page { margin: 36px; }
              body { font-family: Arial, sans-serif; color: #17213c; margin: 0; }
              .header { background: #102a55; color: white; padding: 28px; border-radius: 18px; }
              .brand { color: #75a0ff; font-size: 13px; font-weight: 700; letter-spacing: 1.6px; text-transform: uppercase; }
              h1 { margin: 8px 0 4px; font-size: 30px; }
              .muted { color: #667085; font-size: 12px; }
              .header .muted { color: #b8c8eb; }
              .details, .summary { display: flex; gap: 14px; margin-top: 20px; }
              .box { flex: 1; border: 1px solid #d8e5ff; border-radius: 14px; padding: 14px; }
              .label { color: #667085; font-size: 10px; font-weight: 700; letter-spacing: .7px; text-transform: uppercase; }
              .value { margin-top: 6px; font-size: 16px; font-weight: 700; }
              table { width: 100%; border-collapse: collapse; margin-top: 26px; font-size: 11px; }
              th { background: #eef4ff; color: #667085; padding: 11px 8px; text-align: left; text-transform: uppercase; font-size: 9px; }
              td { border-bottom: 1px solid #e8edf7; padding: 12px 8px; }
              .amount { font-weight: 700; white-space: nowrap; }
              .paid { color: #117a56; background: #eafbf4; padding: 5px 8px; border-radius: 12px; font-weight: 700; }
              .footer { margin-top: 28px; padding-top: 14px; border-top: 1px solid #d8e5ff; color: #98a2b3; font-size: 10px; }
            </style>
          </head>
          <body>
            <section class="header">
              <div class="brand">Baraka Homes</div>
              <h1>Rent Statement</h1>
              <div class="muted">Generated on ${escapeHtml(generatedOn)}</div>
            </section>
            <section class="details">
              <div class="box"><div class="label">Tenant</div><div class="value">${tenantName}</div></div>
              <div class="box"><div class="label">Unit</div><div class="value">${escapeHtml(tenantHome.unit)}</div></div>
              <div class="box"><div class="label">Property</div><div class="value">${escapeHtml(tenantHome.property)}</div></div>
            </section>
            <section class="summary">
              <div class="box"><div class="label">Total paid</div><div class="value">${escapeHtml(formatPrice(paidTotal))}</div></div>
              <div class="box"><div class="label">Balance due</div><div class="value">${escapeHtml(formatPrice(tenantHome.balance))}</div></div>
              <div class="box"><div class="label">Lease ends</div><div class="value">${escapeHtml(tenantHome.leaseEnds)}</div></div>
            </section>
            <table>
              <thead><tr><th>Date</th><th>Description</th><th>Method</th><th>Receipt</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>${transactionRows}</tbody>
            </table>
            <div class="footer">This statement was generated securely by Baraka Homes. Contact your property agent if any payment information is incorrect.</div>
          </body>
        </html>`;

      const { uri } = await Print.printToFileAsync({ html });
      const generatedFile = new File(uri);
      const statementFile = new File(
        Paths.cache,
        `baraka-homes-rent-statement-${tenantHome.unit.toLowerCase()}-${Date.now()}.pdf`
      );

      if (statementFile.exists) {
        statementFile.delete();
      }
      await generatedFile.copy(statementFile);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(statementFile.uri, {
          mimeType: "application/pdf",
          UTI: "com.adobe.pdf",
          dialogTitle: "Save or share rent statement",
        });
      } else {
        Alert.alert("Statement created", `Your PDF was created at ${uri}`);
      }
    } catch (error) {
      console.error("[Payments] Statement download failed:", error);
      Alert.alert("Download failed", "We could not create the statement PDF. Please try again.");
    } finally {
      setDownloadingStatement(false);
    }
  };

  const pay = async () => {
    const numericAmount = Number(amount.replace(/[^0-9]/g, ""));
    if (!numericAmount || numericAmount < 1) {
      Alert.alert("Check amount", "Enter an amount of at least KSh 1.");
      return;
    }
    setSubmitting(true);
    try {
      const reference = `BH${Date.now().toString().slice(-8)}`;
      const result = await initiatePayHeroPayment({ amount: numericAmount, phoneNumber: phone, reference, description: `${tenantHome.unit} ${paymentLabel.toLowerCase()}` });
      setShowPay(false);
      Alert.alert("Check your phone", result.message || "Enter your M-Pesa PIN to complete payment.");
    } catch (error) {
      Alert.alert("Payment not started", error instanceof Error ? error.message : "Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-transparent">
      <ScrollView contentContainerClassName="px-5 pb-32" showsVerticalScrollIndicator={false}>
        <View className="mt-4"><Text className="text-2xl font-rubik-bold text-black-300">Payments</Text><Text className="mt-1 text-sm font-rubik text-black-100">Rent, receipts and account balance</Text></View>
        <View className="mt-6 rounded-[28px] bg-[#102A55] p-5">
          <View className="flex-row items-start justify-between"><View><Text className="text-xs font-rubik text-white/60">CURRENT BALANCE</Text><Text className="mt-2 text-3xl font-rubik-bold text-white">{formatPrice(tenantHome.balance)}</Text><Text className="mt-1 text-xs font-rubik text-[#B8C8EB]">{tenantHome.dueLabel}</Text></View><View className="size-12 items-center justify-center rounded-2xl bg-white/15"><Wallet size={24} color="#FFFFFF" /></View></View>
          <TouchableOpacity onPress={() => openPayment("Rent", tenantHome.balance)} className="mt-5 items-center justify-center rounded-full bg-[#23C483] py-4"><Text className="font-rubik-bold text-white">Pay rent with M-Pesa</Text></TouchableOpacity>
        </View>
        <View className="mt-4 flex-row justify-between">
          <View className="w-[48%] rounded-[22px] bg-white p-4"><Text className="text-xs font-rubik text-black-100">Paid this lease</Text><Text className="mt-2 text-lg font-rubik-bold text-black-300">{formatPrice(paidTotal)}</Text></View>
          <View className="w-[48%] rounded-[22px] bg-white p-4"><Text className="text-xs font-rubik text-black-100">Payment method</Text><Text className="mt-2 text-lg font-rubik-bold text-black-300">M-Pesa</Text></View>
        </View>

        <View className="mt-5 rounded-[26px] bg-white p-5 shadow-sm shadow-slate-200">
          <View className="flex-row items-start justify-between">
            <View>
              <Text className="text-lg font-rubik-bold text-black-300">Bills & utilities</Text>
              <Text className="mt-1 text-xs font-rubik text-black-100">Due with your next payment</Text>
            </View>
            <View className="items-end">
              <Text className="text-[11px] font-rubik text-black-100">TOTAL DUE</Text>
              <Text className="mt-1 text-base font-rubik-bold text-black-300">{formatPrice(chargesTotal)}</Text>
            </View>
          </View>

          <View className="mt-4">
            {currentCharges.map((charge, index) => {
              const ChargeIcon = charge.icon;
              return (
                <View key={charge.id} className={`flex-row items-center py-3 ${index < currentCharges.length - 1 ? "border-b border-primary-100" : ""}`}>
                  <View className="size-11 items-center justify-center rounded-2xl" style={{ backgroundColor: charge.background }}>
                    <ChargeIcon size={21} color={charge.color} strokeWidth={2.1} />
                  </View>
                  <View className="ml-3 flex-1">
                    <Text className="font-rubik-semibold text-black-300">{charge.label}</Text>
                    <Text className="mt-1 text-[11px] font-rubik text-black-100">{charge.detail}</Text>
                  </View>
                  {charge.amount > 0 ? (
                    <View className="items-end">
                      <Text className="font-rubik-bold text-black-300">{formatPrice(charge.amount)}</Text>
                      <TouchableOpacity onPress={() => openPayment(charge.label, charge.amount)} className="mt-1 rounded-full bg-primary-100 px-3 py-1.5">
                        <Text className="text-[11px] font-rubik-semibold text-primary-300">Pay now</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View className="rounded-full bg-[#EAFBF4] px-3 py-1.5">
                      <Text className="text-[11px] font-rubik-semibold text-[#159B6C]">Clear</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          <TouchableOpacity onPress={() => openPayment("Bills and utilities", chargesTotal)} className="mt-3 h-12 flex-row items-center justify-center rounded-full bg-[#102A55]">
            <Wallet size={17} color="#FFFFFF" strokeWidth={2.2} />
            <Text className="ml-2 font-rubik-bold text-white">Pay all bills</Text>
          </TouchableOpacity>
        </View>

        <View className="mt-4 overflow-hidden rounded-[26px] border border-white/80 bg-white p-5 shadow-sm shadow-slate-200">
          <View className="flex-row items-start justify-between">
            <View>
              <Text className="text-base font-rubik-semibold text-black-300">Payment Insights</Text>
              <Text className="mt-2 text-[28px] font-rubik-bold text-black-300">{formatPrice(paidTotal)}</Text>
              <Text className="mt-1 text-xs font-rubik text-black-100">Total rent paid this lease</Text>
            </View>
            <View className="flex-row items-center rounded-xl border border-primary-100 bg-white px-3 py-2">
              <CalendarDays size={14} color="#667085" strokeWidth={2.1} />
              <Text className="ml-2 text-[11px] font-rubik-medium text-black-200">Jul – Oct</Text>
            </View>
          </View>

          <View className="mt-3 h-[220px]">
            <Svg width="100%" height="100%" viewBox="0 0 360 220">
              <Defs>
                <SvgLinearGradient id="paidBar" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor="#08A7A7" stopOpacity="1" />
                  <Stop offset="0.62" stopColor="#35C7C5" stopOpacity="0.72" />
                  <Stop offset="1" stopColor="#DFFFFF" stopOpacity="0.12" />
                </SvgLinearGradient>
                <SvgLinearGradient id="dueBar" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor="#F2A65A" stopOpacity="0.95" />
                  <Stop offset="1" stopColor="#FFF1DF" stopOpacity="0.16" />
                </SvgLinearGradient>
                <Pattern id="diagonalLines" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
                  <Line x1="0" y1="0" x2="0" y2="7" stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.45" />
                </Pattern>
              </Defs>

              {[45, 90, 135, 180].map((y, index) => (
                <Line key={`grid-${y}`} x1="38" y1={y} x2="352" y2={y} stroke="#E9EEF7" strokeWidth="1" strokeDasharray={index === 3 ? undefined : "3 5"} />
              ))}
              <SvgText x="3" y="49" fontSize="9" fill="#98A2B3">25k</SvgText>
              <SvgText x="3" y="94" fontSize="9" fill="#98A2B3">17k</SvgText>
              <SvgText x="3" y="139" fontSize="9" fill="#98A2B3">8k</SvgText>
              <SvgText x="10" y="184" fontSize="9" fill="#98A2B3">0</SvgText>

              {paymentChart.map((item, index) => {
                const x = 50 + index * 78;
                const width = 50;
                const depth = 10;
                const height = Math.max(24, (item.amount / maxChartAmount) * 128);
                const y = 180 - height;
                const frontFill = item.paid ? "url(#paidBar)" : "url(#dueBar)";
                const sideFill = item.paid ? "#8DE7E7" : "#FFD5AA";

                return (
                  <Fragment key={item.label}>
                    <Polygon
                      points={`${x + width},${y} ${x + width + depth},${y + 7} ${x + width + depth},180 ${x + width},180`}
                      fill={sideFill}
                      opacity="0.78"
                    />
                    <Rect x={x} y={y} width={width} height={height} rx="2" fill={frontFill} />
                    <Rect x={x} y={y} width={width} height={height} rx="2" fill="url(#diagonalLines)" />
                    <SvgText x={x + width / 2} y="205" textAnchor="middle" fontSize="10" fontWeight="600" fill={item.paid ? "#667085" : "#C76A22"}>
                      {item.label}
                    </SvgText>
                  </Fragment>
                );
              })}
            </Svg>
          </View>

          <View className="-mt-1 flex-row items-center justify-between rounded-2xl bg-[#F7FAFC] px-4 py-3">
            <View className="flex-row items-center"><View className="mr-2 size-2.5 rounded-full bg-[#08A7A7]" /><Text className="text-xs font-rubik text-black-100">Paid rent</Text></View>
            <View className="flex-row items-center"><View className="mr-2 size-2.5 rounded-full bg-[#F2A65A]" /><Text className="text-xs font-rubik text-black-100">Amount due</Text></View>
          </View>
        </View>

        <View className="mb-3 mt-7 flex-row items-center justify-between">
          <Text className="text-lg font-rubik-bold text-black-300">Payment history</Text>
          <TouchableOpacity onPress={() => setShowStatement(true)} className="h-10 flex-row items-center rounded-full bg-primary-100 px-4">
            <Eye size={17} color="#2F6BFF" strokeWidth={2.2} />
            <Text className="ml-2 text-sm font-rubik-semibold text-primary-300">View statement</Text>
          </TouchableOpacity>
        </View>
        {tenantPayments.map((item) => (
          <TouchableOpacity key={item.id} className="mb-3 flex-row items-center rounded-[22px] bg-white p-4">
            <View className="size-11 items-center justify-center rounded-2xl bg-[#EAFBF4]"><Check size={23} color="#159B6C" /></View>
            <View className="ml-3 flex-1"><Text className="font-rubik-semibold text-black-300">{item.description}</Text><Text className="mt-1 text-xs font-rubik text-black-100">{item.date} • {item.method}</Text></View>
            <View className="items-end"><Text className="font-rubik-bold text-black-300">{formatPrice(item.amount)}</Text><Text className="mt-1 text-[11px] font-rubik-semibold text-[#159B6C]">Receipt</Text></View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal visible={showPay} transparent animationType="slide" onRequestClose={() => setShowPay(false)}>
        <View className="flex-1 justify-end bg-[#071F4A]/45"><View className="rounded-t-[34px] bg-white px-6 pb-9 pt-5">
          <View className="mb-5 h-1.5 w-12 self-center rounded-full bg-primary-200" />
          <View className="flex-row items-center justify-between"><View><Text className="text-2xl font-rubik-bold text-black-300">Pay with M-Pesa</Text><Text className="mt-1 text-sm font-rubik text-black-100">{paymentLabel} - Secure PayHero STK prompt</Text></View><TouchableOpacity onPress={() => setShowPay(false)} className="size-10 items-center justify-center rounded-full bg-primary-100"><X size={22} color="#17213C" /></TouchableOpacity></View>
          <Text className="mb-2 mt-6 text-sm font-rubik-semibold text-black-300">M-Pesa phone number</Text>
          <TextInput value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="0712 345 678" placeholderTextColor="#98A2B3" className="h-14 rounded-2xl border border-primary-200 bg-accent-100 px-4 font-rubik text-black-300" />
          <Text className="mb-2 mt-4 text-sm font-rubik-semibold text-black-300">Amount (KES)</Text>
          <TextInput value={amount} onChangeText={setAmount} keyboardType="number-pad" placeholder="25000" placeholderTextColor="#98A2B3" className="h-14 rounded-2xl border border-primary-200 bg-accent-100 px-4 font-rubik text-black-300" />
          <View className="mt-4 flex-row items-center rounded-2xl bg-[#EAFBF4] p-3"><ShieldCheck size={19} color="#159B6C" /><Text className="ml-2 flex-1 text-xs leading-5 font-rubik text-[#117A56]">You will confirm this payment using your M-Pesa PIN on your phone.</Text></View>
          <TouchableOpacity disabled={submitting} onPress={pay} className="mt-5 h-14 flex-row items-center justify-center rounded-full bg-primary-300">{submitting ? <ActivityIndicator color="#FFFFFF" /> : <><Smartphone size={19} color="#FFFFFF" /><Text className="ml-2 font-rubik-bold text-white">Send M-Pesa prompt</Text></>}</TouchableOpacity>
        </View></View>
      </Modal>

      <Modal visible={showStatement} transparent animationType="slide" onRequestClose={() => setShowStatement(false)}>
        <View className="flex-1 justify-end bg-[#071F4A]/45">
          <View className="max-h-[86%] rounded-t-[34px] bg-white px-6 pb-9 pt-5">
            <View className="mb-5 h-1.5 w-12 self-center rounded-full bg-primary-200" />
            <View className="flex-row items-start justify-between">
              <View className="flex-row items-center">
                <View className="size-11 items-center justify-center rounded-2xl bg-primary-100">
                  <FileText size={22} color="#2F6BFF" strokeWidth={2.2} />
                </View>
                <View className="ml-3">
                  <Text className="text-xl font-rubik-bold text-black-300">Rent statement</Text>
                  <Text className="mt-1 text-xs font-rubik text-black-100">Unit {tenantHome.unit} • Current lease</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setShowStatement(false)} className="size-10 items-center justify-center rounded-full bg-primary-100">
                <X size={21} color="#17213C" />
              </TouchableOpacity>
            </View>

            <View className="mt-5 flex-row justify-between rounded-[22px] bg-[#102A55] p-4">
              <View><Text className="text-xs font-rubik text-white/60">TOTAL PAID</Text><Text className="mt-1 text-xl font-rubik-bold text-white">{formatPrice(paidTotal)}</Text></View>
              <View className="items-end"><Text className="text-xs font-rubik text-white/60">BALANCE DUE</Text><Text className="mt-1 text-xl font-rubik-bold text-[#F6B978]">{formatPrice(tenantHome.balance)}</Text></View>
            </View>

            <ScrollView className="mt-4" showsVerticalScrollIndicator={false}>
              {tenantPayments.map((item) => (
                <View key={item.id} className="mb-3 flex-row items-center rounded-[18px] border border-primary-100 p-3">
                  <View className="size-9 items-center justify-center rounded-xl bg-[#EAFBF4]"><Check size={18} color="#159B6C" /></View>
                  <View className="ml-3 flex-1"><Text className="font-rubik-semibold text-black-300">{item.description}</Text><Text className="mt-1 text-[11px] font-rubik text-black-100">{item.date} • {item.receipt}</Text></View>
                  <Text className="font-rubik-bold text-black-300">{formatPrice(item.amount)}</Text>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity disabled={downloadingStatement} onPress={downloadStatement} className="mt-3 h-14 flex-row items-center justify-center rounded-full bg-primary-300">
              {downloadingStatement ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Download size={19} color="#FFFFFF" strokeWidth={2.2} />
                  <Text className="ml-2 font-rubik-bold text-white">Download statement</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

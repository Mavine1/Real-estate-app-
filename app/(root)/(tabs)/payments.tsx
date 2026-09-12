import { ChartColumn, Check, Download, Eye, FileText, ShieldCheck, Smartphone, Wallet, X } from "lucide-react-native";
import { useMemo, useState } from "react";
import { ActivityIndicator, Alert, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { tenantHome, tenantPayments } from "@/constants/rental";
import { formatPrice } from "@/lib/format";
import { initiatePayHeroPayment } from "@/lib/payhero";

export default function Payments() {
  const [showPay, setShowPay] = useState(false);
  const [showStatement, setShowStatement] = useState(false);
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState(String(tenantHome.balance));
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

  const pay = async () => {
    const numericAmount = Number(amount.replace(/[^0-9]/g, ""));
    if (!numericAmount || numericAmount < 1) {
      Alert.alert("Check amount", "Enter an amount of at least KSh 1.");
      return;
    }
    setSubmitting(true);
    try {
      const reference = `BH${Date.now().toString().slice(-8)}`;
      const result = await initiatePayHeroPayment({ amount: numericAmount, phoneNumber: phone, reference, description: `${tenantHome.unit} rent` });
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
          <TouchableOpacity onPress={() => setShowPay(true)} className="mt-5 items-center justify-center rounded-full bg-[#23C483] py-4"><Text className="font-rubik-bold text-white">Pay rent with M-Pesa</Text></TouchableOpacity>
        </View>
        <View className="mt-4 flex-row justify-between">
          <View className="w-[48%] rounded-[22px] bg-white p-4"><Text className="text-xs font-rubik text-black-100">Paid this lease</Text><Text className="mt-2 text-lg font-rubik-bold text-black-300">{formatPrice(paidTotal)}</Text></View>
          <View className="w-[48%] rounded-[22px] bg-white p-4"><Text className="text-xs font-rubik text-black-100">Payment method</Text><Text className="mt-2 text-lg font-rubik-bold text-black-300">M-Pesa</Text></View>
        </View>

        <View className="mt-4 rounded-[26px] bg-white p-5 shadow-sm shadow-slate-200">
          <View className="flex-row items-start justify-between">
            <View>
              <Text className="text-lg font-rubik-bold text-black-300">Rent overview</Text>
              <Text className="mt-1 text-xs font-rubik text-black-100">Paid versus current amount due</Text>
            </View>
            <View className="size-10 items-center justify-center rounded-2xl bg-primary-100">
              <ChartColumn size={21} color="#2F6BFF" strokeWidth={2.2} />
            </View>
          </View>
          <View className="mt-5 h-36 flex-row items-end justify-between border-b border-primary-100 px-1 pb-2">
            {paymentChart.map((item) => (
              <View key={item.label} className="h-full flex-1 items-center justify-end">
                <Text className="mb-2 text-[10px] font-rubik-semibold text-black-100">
                  {Math.round(item.amount / 1000)}k
                </Text>
                <View className="h-24 w-8 justify-end overflow-hidden rounded-full bg-primary-100">
                  <View
                    className={`w-full rounded-full ${item.paid ? "bg-primary-300" : "bg-[#F2A65A]"}`}
                    style={{ height: `${Math.max(18, (item.amount / maxChartAmount) * 100)}%` }}
                  />
                </View>
                <Text className={`mt-2 text-[11px] font-rubik-semibold ${item.paid ? "text-black-200" : "text-[#C76A22]"}`}>
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
          <View className="mt-4 flex-row items-center justify-between">
            <View className="flex-row items-center"><View className="mr-2 size-2.5 rounded-full bg-primary-300" /><Text className="text-xs font-rubik text-black-100">Paid</Text></View>
            <View className="flex-row items-center"><View className="mr-2 size-2.5 rounded-full bg-[#F2A65A]" /><Text className="text-xs font-rubik text-black-100">Due</Text></View>
            <Text className="text-xs font-rubik-semibold text-[#159B6C]">3 months paid</Text>
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
          <View className="flex-row items-center justify-between"><View><Text className="text-2xl font-rubik-bold text-black-300">Pay with M-Pesa</Text><Text className="mt-1 text-sm font-rubik text-black-100">A secure PayHero STK prompt</Text></View><TouchableOpacity onPress={() => setShowPay(false)} className="size-10 items-center justify-center rounded-full bg-primary-100"><X size={22} color="#17213C" /></TouchableOpacity></View>
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

            <TouchableOpacity onPress={() => Alert.alert("Statement ready", "PDF download will be enabled when statement files are connected.")} className="mt-3 h-14 flex-row items-center justify-center rounded-full bg-primary-300">
              <Download size={19} color="#FFFFFF" strokeWidth={2.2} />
              <Text className="ml-2 font-rubik-bold text-white">Download statement</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

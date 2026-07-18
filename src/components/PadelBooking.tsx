import { useState, useMemo } from 'react';
import { supabase, type PadelBooking } from '../lib/supabase';

// 9 matches: 9:00 AM to 11:00 PM, 90 min each
const TIME_SLOTS = [
  '09:00 - 10:30',
  '10:30 - 12:00',
  '12:00 - 13:30',
  '13:30 - 15:00',
  '15:00 - 16:30',
  '16:30 - 18:00',
  '18:00 - 19:30',
  '19:30 - 21:00',
  '21:00 - 22:30',
];

const MATCH_PRICE = 24;

// WhatsApp number — change to your cafe's number
const WHATSAPP_NUMBER = '1234567890';

type Step = 'form' | 'success';

export default function PadelBookingSection() {
  const [step, setStep] = useState<Step>('form');
  const [form, setForm] = useState({
    name: '',
    phone: '',
    date: '',
    timeSlot: '',
    court: 1 as 1 | 2,
    players: 2 as 2 | 4,
    payment: 'cash' as 'cash' | 'wish',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const pricePerPlayer = useMemo(() => {
    return MATCH_PRICE / form.players;
  }, [form.players]);

  const today = new Date().toISOString().split('T')[0];

  const update = (field: keyof typeof form, value: string | number) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const canBook = form.name && form.phone && form.date && form.timeSlot;

  const buildWhatsAppMessage = (booking: PadelBooking) => {
    const msg = `🎾 *OLIVA Padel Booking*%0A%0A` +
      `👤 *Name:* ${booking.customer_name}%0A` +
      `📞 *Phone:* ${booking.phone}%0A` +
      `📅 *Date:* ${booking.booking_date}%0A` +
      `⏰ *Time:* ${booking.time_slot}%0A` +
      `🏟️ *Court:* ${booking.court}%0A` +
      `👥 *Players:* ${booking.players}%0A` +
      `💵 *Price/Player:* $${booking.price_per_player}%0A` +
      `💰 *Total:* $${booking.total_price}%0A` +
      `💳 *Payment:* ${booking.payment_method.toUpperCase()}`;
    return msg;
  };

  const handleBook = async () => {
    if (!canBook) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setSaving(true);

    const booking: PadelBooking = {
      customer_name: form.name,
      phone: form.phone,
      booking_date: form.date,
      time_slot: form.timeSlot,
      court: form.court,
      players: form.players,
      payment_method: form.payment,
      total_price: MATCH_PRICE,
      price_per_player: pricePerPlayer,
    };

    // Save to Supabase
    const { error: dbError } = await supabase.from('padel_bookings').insert(booking);
    setSaving(false);

    if (dbError) {
      setError('Could not save booking. Please try again.');
      return;
    }

    // Open WhatsApp with pre-filled message
    const message = buildWhatsAppMessage(booking);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');

    setStep('success');
  };

  const reset = () => {
    setStep('form');
    setForm({ name: '', phone: '', date: '', timeSlot: '', court: 1, players: 2, payment: 'cash' });
  };

  return (
    <section id="padel" className="relative py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold text-[#4a6741] tracking-[0.2em] uppercase mb-3">Padel Courts</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-stone-800">Book Your Match</h2>
          <p className="text-stone-500 mt-3">9 daily slots · 90 minutes · $24 per match</p>
        </div>

        <div id="booking" className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Court Map */}
          <div className="bg-white rounded-3xl border border-stone-100 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">
              🗺️ Choose Your Court
            </h3>

            {/* Padel court visual map */}
            <div className="relative bg-[#4a6741]/5 rounded-2xl p-6 mb-4">
              <div className="grid grid-cols-2 gap-4">
                {[1, 2].map((c) => (
                  <button
                    key={c}
                    onClick={() => update('court', c)}
                    className={`relative aspect-[3/4] rounded-xl border-2 transition-all duration-300 hover:scale-105 active:scale-95 ${
                      form.court === c
                        ? 'border-[#4a6741] bg-[#4a6741]/15 shadow-lg shadow-[#4a6741]/20'
                        : 'border-stone-200 bg-white hover:border-[#4a6741]/40'
                    }`}
                  >
                    {/* Court layout */}
                    <svg viewBox="0 0 100 133" className="w-full h-full p-2">
                      {/* Court background */}
                      <rect x="5" y="5" width="90" height="123" rx="3"
                        fill={form.court === c ? '#4a6741' : '#e8f0e7'}
                        fillOpacity="0.15"
                        stroke={form.court === c ? '#4a6741' : '#a8c4a0'}
                        strokeWidth="2"
                      />
                      {/* Net */}
                      <line x1="5" y1="66" x2="95" y2="66"
                        stroke={form.court === c ? '#4a6741' : '#a8c4a0'}
                        strokeWidth="2.5"
                      />
                      {/* Service lines */}
                      <line x1="5" y1="40" x2="95" y2="40"
                        stroke={form.court === c ? '#4a6741' : '#a8c4a0'}
                        strokeWidth="1.5"
                      />
                      <line x1="5" y1="92" x2="95" y2="92"
                        stroke={form.court === c ? '#4a6741' : '#a8c4a0'}
                        strokeWidth="1.5"
                      />
                      {/* Center service line */}
                      <line x1="50" y1="40" x2="50" y2="92"
                        stroke={form.court === c ? '#4a6741' : '#a8c4a0'}
                        strokeWidth="1.5"
                      />
                    </svg>
                    <span className={`absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded ${
                      form.court === c ? 'bg-[#4a6741] text-white' : 'bg-stone-200 text-stone-600'
                    }`}>
                      Court {c}
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-stone-400 text-center mt-3">Tap to select a court</p>
            </div>

            {/* Players selection */}
            <div className="mb-4">
              <label className="text-sm font-semibold text-stone-700 mb-2 block">Players</label>
              <div className="grid grid-cols-2 gap-3">
                {([2, 4] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => update('players', p)}
                    className={`px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 hover:-translate-y-0.5 active:scale-95 ${
                      form.players === p
                        ? 'bg-[#4a6741] text-white shadow-md'
                        : 'bg-stone-50 text-stone-600 border border-stone-200 hover:border-[#4a6741]/40'
                    }`}
                  >
                    {p === 2 ? '👥 2 Players' : '👨‍👩‍👧‍👦 4 Players'}
                  </button>
                ))}
              </div>
            </div>

            {/* Price display */}
            <div className="bg-[#4a6741]/8 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-stone-500">Price per player</p>
                <p className="text-2xl font-bold text-[#4a6741]">${pricePerPlayer.toFixed(0)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-stone-500">Total match</p>
                <p className="text-2xl font-bold text-stone-800">${MATCH_PRICE}</p>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="bg-white rounded-3xl border border-stone-100 p-6 shadow-sm">
            {step === 'form' ? (
              <>
                <h3 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">
                  📝 Booking Details
                </h3>

                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="text-sm font-semibold text-stone-700 mb-1.5 block">Full Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-[#4a6741] focus:ring-2 focus:ring-[#4a6741]/15 outline-none transition-all duration-200 text-stone-700"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="text-sm font-semibold text-stone-700 mb-1.5 block">Phone Number</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => update('phone', e.target.value)}
                      placeholder="+1 234 567 890"
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-[#4a6741] focus:ring-2 focus:ring-[#4a6741]/15 outline-none transition-all duration-200 text-stone-700"
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <label className="text-sm font-semibold text-stone-700 mb-1.5 block">Date</label>
                    <input
                      type="date"
                      min={today}
                      value={form.date}
                      onChange={(e) => update('date', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-[#4a6741] focus:ring-2 focus:ring-[#4a6741]/15 outline-none transition-all duration-200 text-stone-700"
                    />
                  </div>

                  {/* Time slot */}
                  <div>
                    <label className="text-sm font-semibold text-stone-700 mb-2 block">Time Slot (90 min)</label>
                    <div className="grid grid-cols-3 gap-2">
                      {TIME_SLOTS.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => update('timeSlot', slot)}
                          className={`px-2 py-2 rounded-lg text-xs font-medium transition-all duration-200 hover:-translate-y-0.5 active:scale-95 ${
                            form.timeSlot === slot
                              ? 'bg-[#4a6741] text-white shadow-md'
                              : 'bg-stone-50 text-stone-600 border border-stone-200 hover:border-[#4a6741]/40'
                          }`}
                        >
                          {slot.split(' - ')[0]}
                        </button>
                      ))}
                    </div>
                    {form.timeSlot && (
                      <p className="text-xs text-[#4a6741] mt-2 animate-fade-up">
                        Selected: {form.timeSlot}
                      </p>
                    )}
                  </div>

                  {/* Payment method */}
                  <div>
                    <label className="text-sm font-semibold text-stone-700 mb-2 block">Payment Method</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => update('payment', 'cash')}
                        className={`px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 hover:-translate-y-0.5 active:scale-95 ${
                          form.payment === 'cash'
                            ? 'bg-[#4a6741] text-white shadow-md'
                            : 'bg-stone-50 text-stone-600 border border-stone-200 hover:border-[#4a6741]/40'
                        }`}
                      >
                        💵 Cash
                      </button>
                      <button
                        onClick={() => update('payment', 'wish')}
                        className={`px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 hover:-translate-y-0.5 active:scale-95 ${
                          form.payment === 'wish'
                            ? 'bg-[#4a6741] text-white shadow-md'
                            : 'bg-stone-50 text-stone-600 border border-stone-200 hover:border-[#4a6741]/40'
                        }`}
                      >
                        📱 Wish Money
                      </button>
                    </div>
                  </div>

                  {error && (
                    <p className="text-sm text-red-500 animate-fade-up">{error}</p>
                  )}

                  {/* Book via WhatsApp button */}
                  <button
                    onClick={handleBook}
                    disabled={!canBook || saving}
                    className={`group relative w-full py-4 rounded-xl font-bold text-white overflow-hidden transition-all duration-300 ${
                      canBook && !saving
                        ? 'bg-[#25D366] hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-1 active:scale-95'
                        : 'bg-stone-300 cursor-not-allowed'
                    }`}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2 text-base">
                      {saving ? (
                        <>
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3" />
                            <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                          </svg>
                          Booking...
                        </>
                      ) : (
                        <>💬 Book via WhatsApp</>
                      )}
                    </span>
                    {canBook && !saving && (
                      <span className="absolute inset-0 bg-green-600 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
                    )}
                  </button>

                  <p className="text-xs text-stone-400 text-center">
                    Your booking will be sent to our WhatsApp to confirm.
                  </p>
                </div>
              </>
            ) : (
              /* Success state */
              <div className="flex flex-col items-center justify-center text-center py-12 animate-fade-up">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-5 animate-bounce-slow">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-stone-800 mb-2">Booking Sent!</h3>
                <p className="text-stone-500 max-w-xs">
                  We've opened WhatsApp with your booking details. Send the message to confirm your court.
                </p>
                <div className="mt-6 bg-[#4a6741]/8 rounded-xl px-6 py-4 text-left w-full max-w-xs">
                  <div className="space-y-1.5 text-sm">
                    <p className="flex justify-between"><span className="text-stone-400">Court:</span> <span className="font-semibold text-stone-700">Court {form.court}</span></p>
                    <p className="flex justify-between"><span className="text-stone-400">Date:</span> <span className="font-semibold text-stone-700">{form.date}</span></p>
                    <p className="flex justify-between"><span className="text-stone-400">Time:</span> <span className="font-semibold text-stone-700">{form.timeSlot}</span></p>
                    <p className="flex justify-between"><span className="text-stone-400">Players:</span> <span className="font-semibold text-stone-700">{form.players}</span></p>
                    <p className="flex justify-between"><span className="text-stone-400">Total:</span> <span className="font-bold text-[#4a6741]">${MATCH_PRICE}</span></p>
                  </div>
                </div>
                <button
                  onClick={reset}
                  className="mt-6 px-6 py-3 bg-[#4a6741] text-white font-semibold rounded-xl hover:bg-[#3a5232] hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
                >
                  Book Another Match
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

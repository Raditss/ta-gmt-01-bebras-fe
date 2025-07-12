import { useState, useEffect } from 'react';

const RandomQuote = () => {
  const quotes = [
    'Kesuksesan bukan kunci kebahagiaan. Kebahagiaan adalah kunci kesuksesan.',
    'Jangan menunggu kesempatan, tapi ciptakanlah kesempatan itu.',
    'Kegagalan adalah kesempatan untuk memulai kembali dengan lebih cerdas.',
    'Mimpi besar dan berani mengambil langkah pertama untuk mewujudkannya.',
    'Setiap hari adalah kesempatan baru untuk menjadi versi terbaik dari diri sendiri.',
    'Percayalah pada prosesnya, hasil akan mengikuti usaha yang konsisten.',
    'Tantangan hari ini adalah kekuatan untuk hari esok.',
    'Belajar dari kemarin, hidup untuk hari ini, berharap untuk besok.',
    'Keberhasilan dimulai dari keyakinan bahwa kamu bisa melakukannya.',
    'Jangan biarkan ketakutan menghalangi langkahmu menuju impian.',
    'Konsistensi kecil setiap hari menghasilkan perubahan besar.',
    'Fokus pada solusi, bukan pada masalah.',
    'Setiap expert dulunya adalah seorang pemula yang tidak pernah menyerah.',
    'Kemajuan, bukan kesempurnaan, yang penting dalam perjalanan hidup.',
    "Hari ini adalah hadiah, oleh karena itu disebut 'present'.",
    'Jangan membandingkan chapter 1 hidupmu dengan chapter 20 orang lain.',
    'Kesabaran adalah kunci untuk membuka pintu kesuksesan.',
    'Bersyukurlah atas apa yang kamu miliki sambil bekerja untuk apa yang kamu inginkan.',
    'Kebaikan kecil dapat membuat perbedaan besar dalam hidup seseorang.',
    'Hidup 10% tentang apa yang terjadi padamu dan 90% tentang bagaimana kamu meresponsnya.'
  ];

  const [currentQuote, setCurrentQuote] = useState('');

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  };

  useEffect(() => {
    setCurrentQuote(getRandomQuote());
  }, []);

  return (
    <div className="relative">
      <p className={`text-gray-600 text-lg max-w-2xl mx-auto`}>
        {currentQuote}
      </p>
    </div>
  );
};

export default RandomQuote;

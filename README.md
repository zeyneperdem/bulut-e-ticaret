# bulut-e-ticaret

Proje Canlı Erişim Bilgileri
Sistemimiz AWS üzerinde port numarasına ihtiyaç duymadan doğrudan Load Balancer üzerinden tüm internete açık şekilde yayın yapmaktadır:
Canlı Web Vitrini (Ana Sayfa): `http://eticaret-load-balancer-386283612.eu-north-1.elb.amazonaws.com`
API Ham Veri Endpoint'i: `http://eticaret-load-balancer-386283612.eu-north-1.elb.amazonaws.com/urunler`


Proje Teknik Raporu

1. Giriş ve Proje Özeti
Bu proje kapsamında; yüksek erişilebilirlik (High Availability), dinamik ölçeklenebilirlik (Auto Scaling) ve yük dengeleme (Load Balancing) prensiplerine uygun, kurumsal düzeyde bir e-ticaret mimarisi AWS üzerinde uçtan uca tasarlanmıştır.

2. Mimari Bileşenler ve Yapılandırma
Veritabanı Güvenliği (RDS): AWS RDS PostgreSQL servis havuzunda SSL şifrelemesi (`ssl: { rejectUnauthorized: false }`) aktif edilerek veritabanı trafiği tamamen şifreli hale getirilmiştir.
Yük Dengeleyici (ALB): `3000` uygulama portunu dinleyen bir Target Group oluşturulmuş ve Application Load Balancer'a bağlanmıştır. Sağlık kontrolü (Health Check) `/` yolu üzerinden doğrulanmaktadır.
Otomatik Ölçeklendirme (ASG): Kapasite sınırları `Min: 1, Max: 3` olarak belirlenmiş, ortalama CPU yükü **%70**'i geçtiğinde yatayda otomatik büyüme (Target Tracking Policy) kuralı tanımlanmıştır.

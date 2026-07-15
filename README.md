<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ร่วมบริจาค Run for Life - วิ่งด้วยใจ</title>
    <style>
        :root {
            --primary-green: #2e7d32;
            --light-green: #e8f5e9;
            --white: #ffffff;
            --text-dark: #333333;
        }
        body {
            font-family: 'Sarabun', Tahoma, sans-serif;
            background-color: var(--light-green);
            color: var(--text-dark);
            margin: 0;
            padding: 20px;
            display: flex;
            justify-content: center;
        }
        .container {
            background-color: var(--white);
            max-width: 600px;
            width: 100%;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            padding: 30px;
            border-top: 8px solid var(--primary-green);
        }
        .header {
            text-align: center;
            margin-bottom: 25px;
        }
        .header h1 {
            color: var(--primary-green);
            margin-bottom: 5px;
        }
        .header p {
            color: #666;
            margin-top: 0;
        }
        .donation-info {
            background-color: var(--light-green);
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 25px;
            border: 1px solid #c8e6c9;
        }
        .donation-info h3 {
            margin-top: 0;
            color: var(--primary-green);
            text-align: center;
            border-bottom: 2px solid var(--primary-green);
            padding-bottom: 10px;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 15px;
        }
        .info-label { font-weight: bold; color: var(--primary-green); }
        .form-group {
            margin-bottom: 15px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        input[type="text"], input[type="tel"], input[type="file"] {
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 6px;
            box-sizing: border-box;
            font-family: inherit;
        }
        button {
            background-color: var(--primary-green);
            color: var(--white);
            border: none;
            padding: 12px 20px;
            width: 100%;
            font-size: 16px;
            font-weight: bold;
            border-radius: 6px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        button:hover { background-color: #1b5e20; }
        .footer-note {
            text-align: center;
            font-size: 12px;
            color: #888;
            margin-top: 20px;
        }
        #loading { display: none; text-align: center; margin-top: 15px; color: var(--primary-green); font-weight: bold;}
    </style>
</head>
<body>

<div class="container">
    <div class="header">
        <h1>ร่วมบริจาค วิ่งด้วยใจ</h1>
        <p>เพื่อจัดซื้ออุปกรณ์เครื่องมือทางการแพทย์<br>ในโครงการ 72 Years Kajonkiet School Group Fun Run 2026</p>
    </div>

    <div class="donation-info">
        <h3>🏦 บัญชีสำหรับรับบริจาค</h3>
        <div class="info-row">
            <span class="info-label">ชื่อบัญชี:</span>
            <span>โรงเรียนขจรเกียรติพัฒนา<br><small>โดย น.ส. ธิดาพร เหล่าวิเศษกุล</small></span>
        </div>
        <div class="info-row">
            <span class="info-label">ธนาคาร:</span>
            <span>ธนาคารกสิกรไทย (Kasikornbank)</span>
        </div>
        <div class="info-row">
            <span class="info-label">เลขที่บัญชี:</span>
            <span style="font-size: 18px; font-weight: bold;">1022448585</span>
        </div>
    </div>

    <form id="donationForm">
        <div class="form-group">
            <label for="fname">ชื่อ (First Name)</label>
            <input type="text" id="fname" required>
        </div>
        <div class="form-group">
            <label for="lname">นามสกุล (Last Name)</label>
            <input type="text" id="lname" required>
        </div>
        <div class="form-group">
            <label for="phone">เบอร์โทรศัพท์ (Phone Number)</label>
            <input type="tel" id="phone" required>
        </div>
        <div class="form-group">
            <label for="slip">อัปโหลดหลักฐานการโอนเงิน (แนบสลิป)</label>
            <input type="file" id="slip" accept="image/*" required>
        </div>
        <button type="submit" id="submitBtn">ส่งข้อมูลการบริจาค</button>
        <div id="loading">กำลังบันทึกข้อมูล กรุณารอสักครู่...</div>
    </form>

    <div class="footer-note">
        ขอบพระคุณทุกน้ำใจที่ร่วมสนับสนุนโครงการ 💚<br>Every Donation Saves Lives
    </div>
</div>

<script>
    // ใส่ URL ของ Web App ที่ได้จาก Google Apps Script ตรงนี้
    const scriptURL = 'URL_WEB_APP_ของคุณ'; 

    document.getElementById('donationForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btn = document.getElementById('submitBtn');
        const loading = document.getElementById('loading');
        btn.style.display = 'none';
        loading.style.display = 'block';

        const fname = document.getElementById('fname').value;
        const lname = document.getElementById('lname').value;
        const phone = document.getElementById('phone').value;
        const fileInput = document.getElementById('slip');
        const file = fileInput.files[0];

        const reader = new FileReader();
        reader.onload = async function() {
            const fileBase64 = reader.result;
            const payload = {
                fname: fname,
                lname: lname,
                phone: phone,
                fileBase64: fileBase64,
                fileName: file.name,
                mimeType: file.type
            };

            try {
                const response = await fetch(scriptURL, {
                    method: 'POST',
                    body: JSON.stringify(payload)
                });
                const result = await response.json();
                
                if(result.status === 'success') {
                    alert('ส่งข้อมูลสำเร็จ ขอขอบพระคุณที่ร่วมทำบุญครับ/ค่ะ');
                    document.getElementById('donationForm').reset();
                } else {
                    alert('เกิดข้อผิดพลาด: ' + result.message);
                }
            } catch (error) {
                alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
                console.error(error);
            } finally {
                btn.style.display = 'block';
                loading.style.display = 'none';
            }
        };
        reader.readAsDataURL(file);
    });
</script>

</body>
</html>

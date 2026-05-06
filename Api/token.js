import { RtcTokenBuilder, RtcRole } from 'agora-access-token';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  const { channel, uid, role } = req.query;
  const appId = process.env.AGORA_APP_ID;
  const appCertificate = process.env.AGORA_APP_CERTIFICATE;
  
  if (!channel) return res.status(400).json({ error: 'Channel required' });
  if (!appId || !appCertificate) return res.status(500).json({ error: 'Server config error' });

  const expirationTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
  const userRole = role === 'host' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;
  
  const token = RtcTokenBuilder.buildTokenWithUid(
    appId, appCertificate, channel, uid || 0, userRole, privilegeExpiredTs
  );

  res.status(200).json({ token, appId });
}

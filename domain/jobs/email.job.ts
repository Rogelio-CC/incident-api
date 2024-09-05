import cron from 'node-cron'
import { IncidentModel } from '../../src/data/models/incident.model';
import { EmailService } from '../services/email.service';
import { trusted } from 'mongoose';
import { generateIncidentEmailTemplate } from '../templates/email.template';

const emailService = new EmailService();

export const emailJob = () => {
    cron .schedule("*/10 * * * * *", async ()=>{
        //console.log("ejecución cada 10 segundos...")
        try {
            const incidents = await IncidentModel.find({ isEmailSent: false });
            if(!incidents.length){
                console.log("No hay incidentes pendientes por enviar");
                return;
            }

            console.log(`Procesando ${incidents.length} incidentes.`)

            await Promise.all(
                incidents.map(async (incident)=>{
                    console.log(incident)
                    try {
                        const htmlBody = generateIncidentEmailTemplate(
                            incident.title,
                            incident.description,
                            incident.lat,
                            incident.lng
                        )
                        await emailService.sendEmail({
                            to: "rogelioceballos218@gmail.com",
                            subject: `Incidente: ${incident.title}`,
                            htmlBody: htmlBody
                        });
                        console.log(`Email enviado para el incident con Id: ${incident._id}`)
                        let updateIncident = {
                            title: incident.title,
                            description: incident.description,
                            lat: incident.lat,
                            lng: incident.lng,
                            isEmailSent: true
                        };
    
                        await IncidentModel.findByIdAndUpdate(incident._id, updateIncident);
                        console.log(`Incidente actualizado para el Id: ${incident._id}`);
                        
                    } catch (error) {
                        console.error("Error al procesar el incidente")
                    }
                })
            );
            
        } catch (error) {
            console.error("Error durante el envio de correos")
        }
    });
}
import { Request, Response } from "express"
import { IncidentModel } from "../../../data/models/incident.model";
import { EmailService } from "../../../../domain/services/email.service";
export class IncidentController{
    public getIncident = async(req: Request, res: Response) => {
        try{
            const incidents = await IncidentModel.find()
            return res.json(incidents)

        }catch(error){
            return res.json([])
        }
        
    }

    public createIncident = async(req: Request, res:  Response) => {
        try{
            const {title, description,lat,lng} = req.body;
            const newIncident = await IncidentModel.create({
                title: title,
                description: description,
                lat:lat,
                lng:lng
            });
            /* const emailService = new EmailService();
            await emailService.sendEmail({
                to:"rogelioceballos218@gmail.com",
                subject: `Incidente: ${newIncident.title}`,
                htmlBody: `<h1>${newIncident.description}</h1>`
            }) */
            res.json(newIncident)

        }catch(error){
            res.json({message: "Error creando registro"})
        }
    }

    public getIncidentById = async (req: Request, res: Response) => {
        try{
            const { id } = req.params;
            const incident = await IncidentModel.findById(id);
            return res.json(incident)
        }catch(error){
            return res.json({message: "Ocurrio un error al traer un incidente"})
        }
    }

    public updateIncident = async (req: Request, res: Response) => {
        try{
            const { id } = req.params;
            const { title, description, lat, lng} = req.body;
            await IncidentModel.findByIdAndUpdate(id, {
                title,
                description,
                lat,
                lng,
            });
            const updatedIncident = await IncidentModel.findById(id)
            return res.json(updatedIncident)

        }catch(error){
            return res.json({message: "Ocurrio un error al actualizar un incidente"})
        }
    }

    public deleteIncident = async (req:Request,res : Response)=>{
        try {
            const { id } = req.params;
            await IncidentModel.findByIdAndDelete(id);
            return res.json({message:"Incidente eleminado"});
        } catch (error) {
            return res.json({message:"Ocurrio un error al eliminar el incidente"});
        }
    }
}
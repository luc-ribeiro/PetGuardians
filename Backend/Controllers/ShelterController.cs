using Microsoft.AspNetCore.Mvc;
using Backend.Models;

namespace Backend.Controllers;

[ApiController]
[Route("shelter")]

public class ShelterController: ControllerBase {
    private DBPetGuardians db;

    public ShelterController(DBPetGuardians db) {
        this.db = db;
    }

     [HttpGet]
    public ActionResult Read() {
        return Ok(db.Shelters.ToList());
    }

    [HttpPost]
    public ActionResult Create(Shelter shelter) {
        db.Shelters.Add(shelter); 
        db.SaveChanges();

        return Created(shelter.Id.ToString(), shelter);
    }

    [HttpDelete]
    [Route("{id}")]
    public ActionResult Delete(int id) {
        Shelter? shelter = db.Shelters.Find(id);

        if (shelter == null) 
            return NotFound();

        db.Shelters.Remove(shelter);
        db.SaveChanges();

        return Ok();
    }

    [HttpPut]
    [Route("{id}")]
    public ActionResult Update(int id, Shelter shelter) {

        Shelter? _shelter = db.Shelters.Find(id);
        
         if (_shelter == null) 
            return NotFound();

        _shelter.Name = shelter.Name;
        _shelter.CNPJ = shelter.CNPJ;

        db.SaveChanges();
        return Ok();
    }


}
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using AngularJsWithMvc.Models;

namespace AngularJsWithMvc.Controllers
{
    public class GridsController : Controller
    {
        private GridDBContext db = new GridDBContext();

        // GET: Grids
        public ActionResult Index()
        {
            return View(db.Grids.ToList());
        }

        // GET: Grids/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Grid grid = db.Grids.Find(id);
            if (grid == null)
            {
                return HttpNotFound();
            }
            return View(grid);
        }

        // GET: Grids/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Grids/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "ID,GroupBy,SortBy,Direction")] Grid grid)
        {
            if (ModelState.IsValid)
            {
                db.Grids.Add(grid);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(grid);
        }



        // GET: Grids/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Grid grid = db.Grids.Find(id);
            if (grid == null)
            {
                return HttpNotFound();
            }
            return View(grid);
        }

        // POST: Grids/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "ID,GroupBy,SortBy,Direction")] Grid grid)
        {
            if (ModelState.IsValid)
            {
                db.Entry(grid).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(grid);
        }

        // GET: Grids/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Grid grid = db.Grids.Find(id);
            if (grid == null)
            {
                return HttpNotFound();
            }
            return View(grid);
        }

        // POST: Grids/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            Grid grid = db.Grids.Find(id);
            db.Grids.Remove(grid);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        public ActionResult Grids() {
            return View();
        }

        public JsonResult GetGridCustomizationValues() {
            var customvalues = db.Grids.ToList();
            return Json(customvalues, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult SetGridColumnState(string columnState) {
            string path = Server.MapPath("~/App_Data/");
            System.IO.File.WriteAllText(path + "output.json", columnState);
            var columnState1 = System.IO.File.ReadAllText(path + "output.json");
            return Json(columnState1, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetGridColumnState() {
            string path = Server.MapPath("~/App_Data/");
            var columnState = System.IO.File.ReadAllText(path + "output.json");
            return Json(columnState, JsonRequestBehavior.AllowGet);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}